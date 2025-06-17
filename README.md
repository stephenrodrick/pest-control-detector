# Pest Control Detector

## Overview
Pest Control Detector is a computer vision project designed to detect and identify common pests that may infest homes or agricultural areas. This repository contains the code and resources needed to train and deploy a pest detection model.

## Features

- Object detection for various pest types
- Pre-trained models for quick deployment
- Custom training capabilities for specific pest types
- Easy-to-use inference scripts
- Web interface for real-time detection (optional)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/stephenrodrick/pest-control-detector.git
cd pest-control-detector
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### For Inference:
```python
from detector import PestDetector

detector = PestDetector('model_weights.pth')
results = detector.detect('path_to_image.jpg')
print(results)
```

### For Training:
```python
from train import PestTrainer

trainer = PestTrainer(config='config.yaml')
trainer.train()
```

## Dataset

The model is trained on a custom dataset of common household and agricultural pests. The dataset includes:

- Cockroaches
- Rodents
- Termites
- Bed bugs
- Aphids
- Spider mites

To use your own dataset, structure it according to the COCO format and update the config file.

## Pretrained Models

Download pretrained models from the [Releases](https://github.com/stephenrodrick/pest-control-detector/releases) section.

## Web Interface (Optional)

To run the web interface:
```bash
python app.py
```
Then navigate to `http://localhost:5000` in your browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
