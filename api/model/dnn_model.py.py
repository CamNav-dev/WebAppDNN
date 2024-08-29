import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Input
from scikeras.wrappers import KerasClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_curve, auc
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import make_pipeline
import matplotlib.pyplot as plt
import random

# Fijar semillas para reproducibilidad
np.random.seed(42)
random.seed(42)
tf.random.set_seed(42)

# Cargar y preparar datos
data = pd.read_excel("D:\Modelo_Deteccion_TP2\PRUEBAS\datosfinancieros2021.xlsx")
data_ratios = pd.read_excel("D:\Modelo_Deteccion_TP2\PRUEBAS\datosfinancieros2021.xlsx", sheet_name='ratios')
data.fillna(0, inplace=True)
data['Fecha'] = data['Fecha'].astype(str)

# Convertir todas las columnas categóricas a string y calcular medianas
categorical_features = ['Criterio estado financiero', 'Cuenta', 'Detalle', 'Item', 'Fecha']
for col in categorical_features:
    data[col] = data[col].astype(str)

median_values = data.groupby('Criterio estado financiero')['Monto'].median()
data['Label'] = data.apply(lambda x: 1 if x['Monto'] > median_values[x['Criterio estado financiero']] else 0, axis=1)

# Calculo de ratios financieros completos y añadirlos al DataFrame principal
total_sales = data_ratios.loc[data_ratios['Criterio Resultado'] == 'VENTAS', 'Valor Resultado'].sum()
cost_of_sales = data_ratios.loc[data_ratios['Criterio Resultado'] == 'COSTO DE VENTAS', 'Valor Resultado'].sum()
gross_profit = total_sales - cost_of_sales
total_assets = data.loc[data['Criterio estado financiero'] == 'ACTIVO FIJO NETO', 'Monto'].sum()
equity = data.loc[data['Criterio estado financiero'] == 'PATRIMONIO', 'Monto'].sum()
total_liabilities = data.loc[data['Criterio estado financiero'].str.contains('PASIVO'), 'Monto'].sum()
current_liabilities = data.loc[data['Cuenta'] == 'PASIVO CORRIENTE', 'Monto'].sum()
cash = data.loc[data['Cuenta'].str.contains('Efectivo y Equivalentes de Efectivo'), 'Monto'].sum()
inventories = data.loc[data['Cuenta'].str.contains('Mercaderías'), 'Monto'].sum()

# Incluir los ratios calculados como características
data['GP/SAL'] = gross_profit / total_sales
data['OP/SAL'] = gross_profit / total_sales 
data['GP/TA'] = gross_profit / total_assets
data['EBT/Eq'] = (gross_profit - cost_of_sales) / equity
data['ROE'] = gross_profit / equity
data['CACH/TL'] = cash / total_liabilities
data['TL/Eq'] = total_liabilities / equity

# Dividir datos
X = data.drop(['Monto', 'Label'], axis=1)
y = data['Label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocesamiento con OneHotEncoder
preprocessor = ColumnTransformer(transformers=[
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
], remainder='passthrough')

# Modelo DNN
def build_model(input_shape):
    input_layer = Input(shape=(input_shape,))
    dense1 = Dense(128, activation='relu')(input_layer)
    dense2 = Dense(128, activation='relu')(dense1)
    dense3 = Dense(128, activation='relu')(dense2)
    output = Dense(1, activation='sigmoid')(dense3)
    model = Model(inputs=input_layer, outputs=output)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy', 'precision', 'recall', 'auc'])
    return model

# Pipeline con SMOTE y KerasClassifier
smote_pipeline = make_pipeline(
    preprocessor,
    SMOTE(random_state=42),
    KerasClassifier(model=build_model, epochs=50, batch_size=100, verbose=1)
)

# Entrenamiento y evaluación del modelo
input_shape = preprocessor.fit_transform(X_train).shape[1]
smote_pipeline.set_params(kerasclassifier__model__input_shape=input_shape)
smote_pipeline.fit(X_train, y_train)

# Evaluar el modelo y curva ROC
predictions = smote_pipeline.predict(X_test)
probabilities = smote_pipeline.predict_proba(X_test)[:, 1]
fpr, tpr, thresholds = roc_curve(y_test, probabilities)
roc_auc = auc(fpr, tpr)
print(f'Metricas de rendimiento del modelo')
print(f"Accuracy: {accuracy_score(y_test, predictions):.2f}")
print(f"Precision: {precision_score(y_test, predictions):.2f}")
print(f"Recall: {recall_score(y_test, predictions):.2f}")
print(f"F1 Score: {f1_score(y_test, predictions):.2f}")
print(f"ROC AUC: {roc_auc:.2f}")

plt.figure()
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic')
plt.legend(loc='lower right')
plt.show()

# Detección de anomalías integrando ratios y probabilidades
anomaly_threshold = 0.95
anomalies_indices = np.where((probabilities > anomaly_threshold) & (predictions == 1))[0]

# Definir umbrales específicos para cada ratio
thresholds = {
    'GP/SAL': 0.1,  
    'OP/SAL': 0.1,  
    'GP/TA': 0.05, 
    'EBT/Eq': 0.1, 
    'ROE': 0.05,
    'CACH/TL': 0.2, 
    'TL/Eq': 2,  
    'Inventory Turnover': 2
}

# Calcular índices para cada ratio donde el valor es sospechoso
additional_ratios_indices = []
for ratio, threshold in thresholds.items():
    if ratio in X_test.columns:
        if ratio == 'Inventory Turnover':  
            idx = X_test[X_test[ratio] < threshold].index
        else:
            idx = X_test[X_test[ratio] > threshold].index
        additional_ratios_indices.extend(idx)

# Unir todos los índices de anomalías detectados por probabilidades y ratios
combined_indices = np.union1d(anomalies_indices, additional_ratios_indices)

if len(combined_indices) > 0:
    anomalies = X_test.loc[combined_indices] 
    print('Posibles anomalías detectadas:')
    print(anomalies)
else:
    print('Ninguna anomalía detectada.')
