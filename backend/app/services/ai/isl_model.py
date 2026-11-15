"""PyTorch Deep Learning Classifier for Indian Sign Language (ISL)."""

import os
import time
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from backend.app.core.config import settings
from backend.app.services.ai.isl_dataset import ISL_CLASSES, get_isl_class_metadata, generate_isl_dataset
from backend.app.services.ai.landmark_normalizer import HandLandmarkNormalizer


class ISLClassifierNet(nn.Module):
    """Deep Neural Network for 60-class ISL recognition from geometric landmark features."""

    def __init__(self, input_dim: int = 140, num_classes: int = len(ISL_CLASSES)):
        super().__init__()
        self.input_dim = input_dim
        self.num_classes = num_classes

        self.fc1 = nn.Linear(input_dim, 256)
        self.bn1 = nn.BatchNorm1d(256)
        self.relu1 = nn.ReLU()
        self.dropout1 = nn.Dropout(0.15)

        self.fc2 = nn.Linear(256, 128)
        self.bn2 = nn.BatchNorm1d(128)
        self.relu2 = nn.ReLU()
        self.dropout2 = nn.Dropout(0.15)

        self.fc3 = nn.Linear(128, 64)
        self.relu3 = nn.ReLU()

        self.out = nn.Linear(64, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        if x.dim() == 1:
            x = x.unsqueeze(0)

        # Handle batch norm for batch_size=1 during evaluation
        if x.size(0) == 1 and self.training is False:
            h1 = self.relu1(self.fc1(x))
            h2 = self.relu2(self.fc2(h1))
            h3 = self.relu3(self.fc3(h2))
            return self.out(h3)

        x = self.dropout1(self.relu1(self.bn1(self.fc1(x))))
        x = self.dropout2(self.relu2(self.bn2(self.fc2(x))))
        x = self.relu3(self.fc3(x))
        return self.out(x)


class ISLRecognitionEngine:
    """Inference engine managing model lifecycle, predictions, and confidence estimation."""

    def __init__(self, weights_path: Optional[str] = None):
        self.device = torch.device("cpu")
        self.weights_path = weights_path or settings.MODEL_WEIGHTS_PATH
        self.model = ISLClassifierNet(input_dim=140, num_classes=len(ISL_CLASSES)).to(self.device)
        self._is_loaded = False
        self._ensure_model_trained()

    def _ensure_model_trained(self) -> None:
        """Loads existing model weights or trains an initial calibrated model."""
        if os.path.exists(self.weights_path):
            try:
                state_dict = torch.load(self.weights_path, map_location=self.device, weights_only=True)
                self.model.load_state_dict(state_dict)
                self.model.eval()
                self._is_loaded = True
                return
            except Exception:
                pass

        # Train and save new model weights
        self._train_and_save()

    def _train_and_save(self, epochs: int = 35) -> None:
        """Trains the neural network on the ISL dataset and saves weights."""
        X, y = generate_isl_dataset(samples_per_class=20)
        X_t = torch.tensor(X, dtype=torch.float32, device=self.device)
        y_t = torch.tensor(y, dtype=torch.long, device=self.device)

        os.makedirs(os.path.dirname(os.path.abspath(self.weights_path)), exist_ok=True)

        self.model.train()
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.AdamW(self.model.parameters(), lr=0.003, weight_decay=1e-4)

        for _ in range(epochs):
            optimizer.zero_grad()
            outputs = self.model(X_t)
            loss = criterion(outputs, y_t)
            loss.backward()
            optimizer.step()

        self.model.eval()
        torch.save(self.model.state_dict(), self.weights_path)
        self._is_loaded = True

    def predict(
        self,
        features: np.ndarray,
        top_k: int = 5
    ) -> List[Tuple[str, float]]:
        """
        Run inference on a 140-dimensional feature vector.
        Returns list of (sign_key, confidence_probability) sorted descending.
        """
        self.model.eval()
        with torch.no_grad():
            x = torch.tensor(features, dtype=torch.float32, device=self.device)
            logits = self.model(x)
            probs = torch.softmax(logits, dim=-1).squeeze(0)

            top_probs, top_indices = torch.topk(probs, min(top_k, len(ISL_CLASSES)))
            results = []
            for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
                sign_key = ISL_CLASSES[idx]
                results.append((sign_key, float(prob)))

            return results


_engine_instance: Optional[ISLRecognitionEngine] = None


def get_isl_classifier() -> ISLRecognitionEngine:
    """Get singleton instance of the ISL recognition engine."""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = ISLRecognitionEngine()
    return _engine_instance

