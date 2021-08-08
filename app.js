// Spinner
const spinnerLoading = () =>{
  document.getElementById("spinner-loading").style.display = "";
}

const spinnerComplete = () =>{
  document.getElementById("spinner-loading").style.display = "none";
}

// Download output file
const downloadOutputResult = (content, fileName) => {
  const a = document.createElement("a");
  const url = new Blob([JSON.stringify(content, null, 2)], {
    type: "text/plain"
  });
  a.href = URL.createObjectURL(url);
  URL.revokeObjectURL(url);

  a.setAttribute("download", fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


// Geosjon structure
featureCollectionObject = {
  "type": "FeatureCollection",
  "features": []
};


// Create geojson
const createGeojson = async (jsonData) => {
  Object.values(jsonData).forEach(properties => {

    // feature structure
    const featureObject = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": []
      }
    };

    for (field in properties) {
      // create feature properties
      if (field !== 'elevation' && field !== 'lat' && field !== 'lon') {
        featureObject.properties[field] = properties[field];

      } else {
        // create feature geometry coordinates
        const newCoordinates = [properties['lon'], properties['lat'], properties['elevation']];

        featureObject.geometry.coordinates = newCoordinates;
      }

    };

    featureCollectionObject.features.push(featureObject);
  });
};


// Form
const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const jsonUploaded = document.getElementById('import-json').files[0];

  const reader = new FileReader();

  reader.onload = () => {
    spinnerLoading();

    const jsonData = JSON.parse(reader.result);

    createGeojson(jsonData)
      .then(() => {
        spinnerComplete();
        downloadOutputResult(featureCollectionObject, "output.txt");
      })
  }

  reader.readAsText(jsonUploaded);
});
