import os
import shutil
import argparse
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_YAML = os.path.join(BASE_DIR, "dataset", "data.yaml")
WEIGHTS_DIR = os.path.join(BASE_DIR, "weights")
OUTPUT_MODEL_PATH = os.path.join(WEIGHTS_DIR, "pothole_yolov8.pt")

def train(epochs=10, imgsz=640, batch=16, device=""):
    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    
    # 1. Base weights (use local yolov8n.pt if present, else download)
    base_model_path = os.path.join(BASE_DIR, "yolov8n.pt")
    if not os.path.exists(base_model_path):
        base_model_path = "yolov8n.pt"

    print(f"[*] Initializing YOLOv8 base model from: {base_model_path}")
    model = YOLO(base_model_path)

    # 2. Check device
    import torch
    if device == "":
        device = "0" if torch.cuda.is_available() else "cpu"
    print(f"[*] Using compute device: {device} (CUDA available: {torch.cuda.is_available()})")

    # 3. Train model
    print(f"[*] Starting YOLOv8 training on dataset: {DATASET_YAML}")
    print(f"[*] Parameters: epochs={epochs}, imgsz={imgsz}, batch={batch}, device={device}")
    
    results = model.train(
        data=DATASET_YAML,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        device=device,
        project=os.path.join(BASE_DIR, "runs"),
        name="pothole_train",
        exist_ok=True,
        workers=2,
        verbose=True
    )

    # 4. Locate best.pt
    run_best = os.path.join(BASE_DIR, "runs", "pothole_train", "weights", "best.pt")
    if os.path.exists(run_best):
        shutil.copy(run_best, OUTPUT_MODEL_PATH)
        print(f"[+] Successfully exported best model to: {OUTPUT_MODEL_PATH}")
    else:
        # Fallback to last.pt or current model
        run_last = os.path.join(BASE_DIR, "runs", "pothole_train", "weights", "last.pt")
        if os.path.exists(run_last):
            shutil.copy(run_last, OUTPUT_MODEL_PATH)
            print(f"[+] Exported last model checkpoint to: {OUTPUT_MODEL_PATH}")
        else:
            model.save(OUTPUT_MODEL_PATH)
            print(f"[+] Saved model to: {OUTPUT_MODEL_PATH}")

    # 5. Run validation evaluation
    print("[*] Running validation evaluation on test/valid split...")
    trained_model = YOLO(OUTPUT_MODEL_PATH)
    metrics = trained_model.val(data=DATASET_YAML, split="val")
    
    print("\n" + "=" * 50)
    print("🎯 YOLOv8 POTHOLE DETECTION VALIDATION REPORT")
    print("=" * 50)
    try:
        print(f"mAP@50:    {metrics.box.map50:.4f}")
        print(f"mAP@50-95: {metrics.box.map:.4f}")
        print(f"Precision: {metrics.box.p[0]:.4f}" if len(metrics.box.p) > 0 else "Precision: N/A")
        print(f"Recall:    {metrics.box.r[0]:.4f}" if len(metrics.box.r) > 0 else "Recall: N/A")
    except Exception as e:
        print(f"Validation metrics summary: {metrics}")
    print("=" * 50)

    return OUTPUT_MODEL_PATH

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLOv8 on Kaggle Pothole Dataset")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    parser.add_argument("--device", type=str, default="", help="cuda device (e.g. 0) or cpu")
    args = parser.parse_args()

    train(epochs=args.epochs, imgsz=args.imgsz, batch=args.batch, device=args.device)
