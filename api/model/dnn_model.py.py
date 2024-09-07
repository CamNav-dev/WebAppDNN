import sys
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
import io
import traceback


def main():
    try:
        print("Python script started", file=sys.stderr, flush=True)

        # Set seeds for reproducibility
        np.random.seed(43)
        random.seed(43)
        tf.random.set_seed(43)

        # Read the Excel file from stdin
        print("Reading Excel file from stdin", file=sys.stderr, flush=True)
        excel_data = sys.stdin.buffer.read()
        financial_data = pd.read_excel(io.BytesIO(excel_data))
        financial_ratios_data = pd.read_excel(io.BytesIO(excel_data), sheet_name='ratios')
        financial_data.fillna(0, inplace=True)
        financial_data['Fecha'] = financial_data['Fecha'].astype(str)

        print("Excel file read successfully", file=sys.stderr, flush=True)
        print(f"Financial data shape: {financial_data.shape}", file=sys.stderr, flush=True)
        print(f"Financial ratios data shape: {financial_ratios_data.shape}", file=sys.stderr, flush=True)

            # Convert all categorical columns to string and compute medians
        categorical_features = ['Criterio estado financiero', 'Cuenta', 'Detalle', 'Item', 'Fecha']
        for col in categorical_features:
            financial_data[col] = financial_data[col].astype(str)
        median_values = financial_data.groupby('Criterio estado financiero')['Monto'].median()
        financial_data['Label'] = financial_data.apply(lambda x: 1 if x['Monto'] > median_values[x['Criterio estado financiero']] else 0, axis=1)

        # Calculate complete financial ratios and add them to the main DataFrame
        total_sales = financial_ratios_data.loc[financial_ratios_data['Criterio Resultado'] == 'VENTAS', 'Valor Resultado'].sum()
        cost_of_sales = financial_ratios_data.loc[financial_ratios_data['Criterio Resultado'] == 'COSTO DE VENTAS', 'Valor Resultado'].sum()
        gross_profit = total_sales - cost_of_sales
        total_assets = financial_data.loc[financial_data['Criterio estado financiero'] == 'ACTIVO FIJO NETO', 'Monto'].sum()
        equity = financial_data.loc[financial_data['Criterio estado financiero'] == 'PATRIMONIO', 'Monto'].sum()
        total_liabilities = financial_data.loc[financial_data['Criterio estado financiero'].str.contains('PASIVO'), 'Monto'].sum()
        current_liabilities = financial_data.loc[financial_data['Cuenta'] == 'PASIVO CORRIENTE', 'Monto'].sum()
        cash = financial_data.loc[financial_data['Cuenta'].str.contains('Efectivo y Equivalentes de Efectivo'), 'Monto'].sum()

        # Include calculated ratios as features
        financial_data['GP_to_Sales'] = gross_profit / total_sales
        financial_data['GP_to_Total_Assets'] = gross_profit / total_assets
        financial_data['EBT_to_Equity'] = (gross_profit - cost_of_sales) / equity
        financial_data['ROE'] = gross_profit / equity
        financial_data['Cash_to_Total_Liabilities'] = cash / total_liabilities
        financial_data['Total_Liabilities_to_Equity'] = total_liabilities / equity

        # Split data
        X = financial_data.drop(['Monto', 'Label'], axis=1)
        y = financial_data['Label']
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=43)

        # Preprocessing with OneHotEncoder
        preprocessor = ColumnTransformer(transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ], remainder='passthrough')

        # DNN Model
        def build_model(input_shape):
            input_layer = Input(shape=(input_shape,))
            dense1 = Dense(128, activation='relu')(input_layer)
            dense2 = Dense(128, activation='relu')(dense1)
            dense3 = Dense(128, activation='relu')(dense2)
            output = Dense(1, activation='sigmoid')(dense3)
            model = Model(inputs=input_layer, outputs=output)
            model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy', 'precision', 'recall', 'auc'])
            return model

        # Pipeline with SMOTE and KerasClassifier
        smote_pipeline = make_pipeline(
            preprocessor,
            SMOTE(random_state=43),
            KerasClassifier(model=build_model, epochs=50, batch_size=100, verbose=1)
        )

        # Train and evaluate the model
        input_shape = preprocessor.fit_transform(X_train).shape[1]
        smote_pipeline.set_params(kerasclassifier_model_input_shape=input_shape)
        smote_pipeline.fit(X_train, y_train)

        # Evaluate the model and ROC curve
        predictions = smote_pipeline.predict(X_test)
        probabilities = smote_pipeline.predict_proba(X_test)[:, 1]
        fpr, tpr, thresholds = roc_curve(y_test, probabilities)
        roc_auc = auc(fpr, tpr)

        def plot_to_base64(fig):
            buf = io.BytesIO()
            fig.savefig(buf, format='png')
            buf.seek(0)
            import base64
            return base64.b64encode(buf.getvalue()).decode('utf-8')

        print(f'Performance Metrics')
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

        # Anomaly detection integrating ratios and probabilities
        anomaly_threshold = 0.95
        anomalies_indices = np.where((probabilities > anomaly_threshold) & (predictions == 1))[0]
        anomalies_indices = X_test.iloc[anomalies_indices].index 

        # Define specific thresholds for each ratio
        thresholds = {
            'GP_to_Sales': 0.1,  
            'GP_to_Total_Assets': 0.05, 
            'EBT_to_Equity': 0.1, 
            'ROE': 0.05,
            'Cash_to_Total_Liabilities': 0.2, 
            'Total_Liabilities_to_Equity': 2
        }

        # Calculate indices for each ratio where the value is suspicious
        additional_ratios_indices = []
        for ratio, threshold in thresholds.items():
            if ratio in X_test.columns:
                idx = X_test[X_test[ratio] > threshold].index
                additional_ratios_indices.extend(idx)

        # Combine all indices of detected anomalies by probabilities and ratios
        combined_indices = np.union1d(anomalies_indices, additional_ratios_indices)
        
        if len(combined_indices) > 0:
            anomalies = X_test.loc[combined_indices]
            print('Possible anomalies detected:', flush=True)
            print(anomalies, flush=True)
        else:
            print('No anomalies detected.', flush=True)
        
        print("Python script completed successfully", file=sys.stderr, flush=True)
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr, flush=True)
        traceback.print_exc(file=sys.stderr, flush=True)
        sys.exit(1)
        
if __name__ == "_main_":

    main()