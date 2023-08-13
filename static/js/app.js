const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);


// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });

  // intialising function for Dashboard

function init(){

  // Selecting dropdownmenu using D3

    let dropmenu = d3.select('#selDataset');

    d3.json(url).then(function(data) {
        //console.log(data.metadata);
        //console.log(data.metadata[0]);

     // getting the id names 
     let names = data.names;

     // Add samples to dropdown menu
       names.forEach((id) => {
    
     // Adding value of id for each iteration 
        console.log(id);
    
        dropmenu.append("option")
        .text(id)
        .property("value",id);
            });

      });

   

};

function CreateMetadata(samples) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      // Getting metadata
      let metadata = data.metadata;

      // Filtering based on sample data
      let value = metadata.filter(result => result.id == samples);

      // Log the array of metadata objects after they have been filtered
      console.log(value)

      // Get the first index from the array
      let valueData = value[0];

      // Clear out metadata
      d3.select("#sample-metadata").html("");

      // Use Object.entries to add each key/value pair to the panel
      Object.entries(valueData).forEach(([key,value]) => {

          // Log the individual key/value pairs as they are being appended to the metadata panel
          console.log(key,value);

          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });

};

// Function that builds the bar chart
function CreateBarChart(samples) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      // Retrieve all sample data
      let sampleInfo = data.samples;

      // Filter based on the value of the sample
      let value = sampleInfo.filter(result => result.id == samples);

      // Getting first index from the array
      let valueData = value[0];

      // Getting otu_ids, lables, and sample values
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      // Logging the data to console
      console.log(otu_ids,otu_labels,sample_values);

      // Set top ten items to display in descending order
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      
      // Set up the trace for the bar chart
      let trace = {
          x: xticks,
          y: yticks,
          text: labels,
          type: "bar",
          orientation: "h"
      };

      // Setup the layout
      let layout = {
          title: "Top 10 OTUs Present"
      };

      // Calling Plotly for the bar chart
      Plotly.newPlot("bar", [trace], layout)
  });
};

// Function that builds the bubble chart
function CreateBubbleChart(samples) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {
      
      // Retrieve all sample data
      let sampleInfo = data.samples;

      // Filter based on the value of the sample
      let value = sampleInfo.filter(result => result.id == samples);

      // Get the first index from the array
      let valueData = value[0];

      // Get the otu_ids, lables, and sample values
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      // Log the data to the console
      console.log(otu_ids,otu_labels,sample_values);
      
      // Set up the trace for bubble chart
      let trace1 = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          }
      };

      // Set up the layout
      let layout = {
          title: "Bacteria Per Sample",
          hovermode: "closest",
          xaxis: {title: "OTU ID"},
      };

      // Call Plotly to plot the bubble chart
      Plotly.newPlot("bubble", [trace1], layout)
  });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

  // Log the new value
  console.log(value); 

  // Call all functions 
  CreateMetadata(value);
  CreateBarChart(value);
  CreateBubbleChart(value);
  CreateGaugeChart(value);
};



init();  // calling function