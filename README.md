# [README_Medical_Image_Diagnosis_Assistant_Simple.md](https://github.com/user-attachments/files/34650435/README_Medical_Image_Diagnosis_Assistant_Simple.md)# Medical Image Diagnosis Assistant

This project is a web application for analysing chest X-ray images and
brain MRI images using deep learning.

The user selects the type of scan, uploads an image, and receives a
model prediction with a confidence score.

**This is an academic project, not a medical device. Its results are not
a medical diagnosis and must not be used to make treatment decisions.**

## Project features

-   Chest X-ray classification: Normal or Pneumonia.
-   Brain MRI classification: Glioma, Meningioma, Pituitary Tumour or No
    Tumour, depending on the dataset used.
-   Image preprocessing before prediction.
-   CNN and ResNet models.
-   Grad-CAM visualisation where available.
-   A web interface for uploading images and viewing results.
-   A backend that sends each image to the correct model.

## Team task division

The project is divided into four parts. Each person or group is
responsible for one part.

### 1. Brain MRI

**Main task:** Build the brain MRI tumour classification model.

Tasks: - Find and prepare a suitable brain MRI dataset. - Check the
images and labels. - Split the data into training, validation and test
sets. - Preprocess the MRI images. - Build and train a CNN model. - Try
ResNet and compare the results. - If the dataset contains ordered MRI
slices, experiment with LSTM or GRU. - Save the trained model. - Test
the model and record its results.

**Deliverables:** - MRI model code. - MRI preprocessing code. - A
function that accepts MRI input and returns predictions. - Trained model
weights. - A short report with the dataset, results and limitations.

### 2. Chest X-ray

**Main task:** Build the chest X-ray classification model.

Tasks: - Find and prepare a suitable chest X-ray dataset. - Check the
images and labels. - Split the data into training, validation and test
sets. - Resize and normalise the images. - Build and train a CNN
model. - Try ResNet and compare the results. - Add Grad-CAM to show
which parts of an image influenced the prediction. - Save the trained
model. - Test the model and record its results.

**Deliverables:** - X-ray model code. - X-ray preprocessing code. -
Grad-CAM code. - A function that accepts an X-ray image and returns
predictions. - Trained model weights. - A short report with the dataset,
results and limitations.

### 3. Frontend

**Main task:** Build the website that users will interact with.

Use React, TypeScript and Tailwind CSS.

The design should look like a real healthcare application. Keep it clean
and simple. Avoid unnecessary animations, too many colours, fake
statistics and generic AI-style dashboard designs.

Pages and features: - Home page with two options: X-ray and Brain MRI. -
Image upload page. - Image preview before analysis. - Loading state
while the model is running. - Results page showing the prediction and
confidence score. - Grad-CAM heatmap when available. - Clear error
messages if an upload or analysis fails.

The frontend should send requests to the backend. It should not run the
deep learning models itself.

**Deliverables:** - Complete frontend code. - Responsive layout. -
Upload and results screens. - API connection to the backend.

### 4. Backend and integration

**Main task:** Connect the frontend with both deep learning models.

Use Node

Tasks: - Create the Node application. - Receive the selected scan
type and uploaded image. - Check the file type, size and image
validity. - If the user selects X-ray, send the image to the X-ray
model. - If the user selects MRI, send the image to the MRI model. -
Receive the prediction and scores from the model. - Send the result back
to the frontend. - Handle errors if a model or file is unavailable. -
Test both workflows.

**Deliverables:** - Node backend. - API endpoints. - Model routing
code. - Input validation. - Integration tests.

## How the application works

1.  The user opens the website.
2.  The user selects either **Chest X-ray** or **Brain MRI**.
3.  The user uploads an image.
4.  The frontend sends the image and selected scan type to the backend.
5.  The backend checks the request.
6.  The backend sends the image to the correct model.
7.  The model processes the image and returns a prediction.
8.  The backend sends the result to the frontend.
9.  The frontend displays the prediction, confidence score and available
    heatmap.

## API details

The frontend and backend should use the same API format.

### Analyse an image

`POST /api/v1/analyze`

Send the request as `multipart/form-data`.

  Field        Type     Description
  ------------ -------- -----------------
  `modality`   String   `xray` or `mri`
  `file`       File     Uploaded scan

Example response:

``` json
{
  "modality": "xray",
  "predicted_class": "PNEUMONIA",
  "scores": {
    "NORMAL": 0.12,
    "PNEUMONIA": 0.88
  },
  "model_name": "resnet18-xray",
  "explanation": {
    "available": true,
    "type": "gradcam"
  }
}
```

The values above are only examples. The application must return actual
model results. Do not show a heatmap if the selected model does not
support it.

Other endpoints:

  Method   Endpoint            Purpose
  -------- ------------------- --------------------------------------
  GET      `/health`           Check whether the backend is running
  GET      `/api/v1/models`    Show available models
  POST     `/api/v1/analyze`   Analyse an uploaded image

### Important note about MRI uploads

The first version can work with a single 2D MRI image if the MRI model
is trained for that input. If the team later builds a model for multiple
MRI slices or full MRI volumes, the upload format and API will need to
be updated. A single slice should not be treated as a complete MRI scan.

## Suggested folder structure

``` text
medical-image-diagnosis/
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── schemas/
│   └── tests/
│
├── dl/
│   ├── mri/
│   │   ├── models/
│   │   ├── preprocessing/
│   │   └── inference.py
│   │
│   └── xray/
│       ├── models/
│       ├── preprocessing/
│       ├── explainability/
│       └── inference.py
│
├── datasets/
├── artifacts/
├── reports/
├── requirements.txt
└── README.md
```

Do not upload datasets, private patient information, passwords or large
model files to GitHub.

## Suggested development order

1.  Create the GitHub repository and agree on the API format.
2.  The MRI and X-ray teams start building their models.
3.  The frontend team builds the website using sample results.
4.  The backend team creates the API and connects it to temporary mock
    models.
5.  Connect the X-ray model.
6.  Connect the MRI model.
7.  Add Grad-CAM and display the results.
8.  Test the complete application.
9.  Update the README with installation and usage instructions.

## Git collaboration

Create a separate branch for each part:

-   `feature/mri`
-   `feature/xray`
-   `feature/frontend`
-   `feature/backend`

Merge completed work into the main development branch through pull
requests. Keep the API format consistent so that all four parts can work
together.

## Final checklist

-   [ ] User can select X-ray or MRI.
-   [ ] The correct model runs for the selected scan type.
-   [ ] Both models return predictions.
-   [ ] The frontend displays the results.
-   [ ] Confidence scores are shown clearly.
-   [ ] Grad-CAM is shown where available.
-   [ ] Invalid files produce a clear error.
-   [ ] Both model pipelines have test results.
-   [ ] The application works from upload to result.

## Team responsibilities

  Part   Work          Main output
  ------ ------------- -----------------------------------
  1      Brain MRI     Brain tumour classification model
  2      Chest X-ray   Pneumonia classification model
  3      Frontend      Website and user interface
  4      Backend       API and integration

**All four parts must follow the same API format so they can be
connected into one application.**
