import { csv } from 'd3';
import { convertToArrObj } from './convertToArrObj.js';

var dataset;

csv('mock.csv').then(data => {
  dataset = data;
  var total = data.length;
  
  /*
  * Get Categorical data of Study and Country
  */
  var cStudy = data.map(item => item.study_id)
  	.filter((value, index, self) => self.indexOf(value) === index)
  	.sort();
  cStudy.unshift("all");
  
  var cCountry = data.map(item => item.country)
  	.filter((value, index, self) => self.indexOf(value) === index)
  	.sort();
  cCountry.unshift("all");

  // Get Occurence of Quiz Completion [Complete | Incomplete]
  var completion = {};
  data.forEach( item => {
    completion[item.quiz_completion] = (completion[item.quiz_completion] || 0) + 1
  });
  
	// Get Occurence of Document Type [Uploaded | eConsent]
  var dType = [];
  data.forEach( item => {
    dType[item.document] = (dType[item.document] || 0) + 1
  });
  
  // Get Occurence of Study Items
  var study = [];
  data.forEach( item => {
    study[item.study_id] = (study[item.study_id] || 0) + 1
  });
  
  // Get Occurence of Country
  var country = [];
  data.forEach( item => {
    country[item.country] = (country[item.country] || 0) + 1
  });
  
  /*
  * Convert to Array Object
  */
  var newCompletion = convertToArrObj(completion);
  var newDocumentType = convertToArrObj(dType);
  var newStudy = convertToArrObj(study);
  var newCountry = convertToArrObj(country);
  
  // Sort Array of Study Alphabetical
  newStudy.sort(function(a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  // Sort Array of Country by Nominal
  newCountry.sort( (a, b) => parseFloat(b.frequency) - parseFloat(a.frequency))
  
  /*
  * Render all Charts
  */
  renderPie(newCompletion, 'completionChart', 'Quiz Completion by Study Type', cStudy);
  renderPie(newDocumentType, 'documentChart', 'Document used by Type', cStudy);
  renderBar(newCountry, 'countryChart', 'Participant by Country', cStudy);
  renderBar(newStudy, 'studyChart', 'Study Consent Shared by Country', cCountry);
  
});

const createCanvas = (canvasid, category) => {
  
  
  // Get Container Element
  var div = document.getElementById('container');
  
  // Create SubContent Element
  var divcontent = document.createElement('div');
  divcontent.className = "subcontent";
  divcontent.setAttribute('style', 'padding-bottom:20px; margin-bottom:30px;');
  divcontent.style.border = "2px solid";
  
  // Append SubContent to Container
  div.appendChild(divcontent);
  
  // Create Canvas
  var canvas = document.createElement('canvas');
  canvas.id = canvasid;
  canvas.setAttribute('width', '300');
  canvas.setAttribute('height', '100');
  
  // Append Canvas to SubContent
  divcontent.appendChild(canvas)
  
  /*
  * Generating Filter on each Charts
  */
  if(canvasid == 'completionChart') {

    var select = document.createElement("select");
    select.name = canvasid;
    
    for (const val of category) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val;
      select.appendChild(option);
    }
    
    var label = document.createElement("label");
    label.setAttribute('style', 'text-align:left');
    label.innerHTML = "Choose Study Type: ";
    label.htmlFor = "study";
    
    divcontent.appendChild(label).appendChild(select);

  }
  
  if(canvasid == 'documentChart') {

    var select = document.createElement("select");
    select.name = canvasid;
    
    for (const val of category) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val;
      select.appendChild(option);
    }
    
    var label = document.createElement("label");
    label.setAttribute('style', 'text-align:left');
    label.innerHTML = "Choose Study Type: ";
    label.htmlFor = "document";
    
    divcontent.appendChild(label).appendChild(select);

  }
  
  if(canvasid == 'countryChart') {

    var select = document.createElement("select");
    select.name = canvasid;
    
    for (const val of category) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val;
      select.appendChild(option);
    }
    
    var label = document.createElement("label");
    label.setAttribute('style', 'text-align:left');
    label.innerHTML = "Choose Study Type: ";
    label.htmlFor = "document";
    
    divcontent.appendChild(label).appendChild(select);

  }
  
  if(canvasid == 'studyChart') {

    var select = document.createElement("select");
    select.name = canvasid;
    
    for (const val of category) {
      var option = document.createElement("option");
      option.value = val;
      option.text = val;
      select.appendChild(option);
    }
    
    var label = document.createElement("label");
    label.setAttribute('style', 'text-align:left');
    label.innerHTML = "Filter Country: ";
    label.htmlFor = "study";
    
    divcontent.appendChild(label).appendChild(select);

  }

  return canvas;
}

// Function to get Random Color
const getRandomColor = () => {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Rendering the Pie Charts
const renderPie = (data, canvasid, title, category) => {
  
  var ctx = createCanvas(canvasid, category);
  
  var name = _.pluck(data, 'name');
  var frequency = _.pluck(data, 'frequency');
  
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: name,
      datasets: [{
        label: 'Frequencies',
        data: frequency,
        backgroundColor: [
          getRandomColor(),  
          getRandomColor()
        ],
      }]
    },
    options: {
        title: {
            display: true,
            text: title
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                return previousValue + currentValue;
              });
              var currentValue = dataset.data[tooltipItem.index];
              var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
              return percentage + "%";
            }
          }
        }
    }
  });
  
  document.getElementsByName(`${canvasid}`)[0].onchange = function() {
    var index = this.selectedIndex;
    var inputText = this.children[index].innerHTML.trim();
    refreshChart(myPieChart, inputText, canvasid);
  }
}



// Rendering Bar and Doughnut Charts
const renderBar = (data, canvasid, title, category) => {
  
  var ctx = createCanvas(canvasid, category);
  
  var name = _.pluck(data, 'name');
  var frequency = _.pluck(data, 'frequency');
  
  var myChart;
  if(canvasid == 'studyChart') {
    myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: name,
        datasets: [{
          label: 'Frequencies',
          data: frequency,
          backgroundColor: [
          getRandomColor(),  
          getRandomColor(),
          getRandomColor(),
          getRandomColor(),
          getRandomColor(),
        ],
        }]
      },
      options: {
          title: {
              display: true,
              text: title
          },
      }
    });
  } else {
		myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: name,
        datasets: [{
          label: 'Frequencies',
          data: frequency,
          backgroundColor: 	"rgba(136,172,212,1)"
        }]
      },
      options: {
          title: {
              display: true,
              text: title
          },
      }
    });

  }
  
  document.getElementsByName(`${canvasid}`)[0].onchange = function() {
    var index = this.selectedIndex;
    var inputText = this.children[index].innerHTML.trim();
    refreshChart(myChart, inputText, canvasid);
  }

}

// Refreshing Chart by Filter
const refreshChart = (chart, selected, canvasid) => {
  var localdata = dataset;
  var newArray;
  // Filter the daya by ID of Study
  if(selected == 'all') {
    newArray = localdata;
  } else {
    
    if(canvasid == 'studyChart'){
      newArray = localdata.filter(function(item){
        return item.country == selected;
      },{selected})
    } else {
      newArray = localdata.filter(function(item){
        return item.study_id == selected;
      },{selected})
    }
    
  }
  
  var dataFiltered = [];
  if(canvasid == 'completionChart') {
    newArray.forEach( item => {
      dataFiltered[item.quiz_completion] = (dataFiltered[item.quiz_completion] || 0) + 1
    });
  }

  if(canvasid == 'documentChart') {
    newArray.forEach( item => {
      dataFiltered[item.document] = (dataFiltered[item.document] || 0) + 1
    });
  }
  
  if(canvasid == 'studyChart'){
    newArray.forEach( item => {
      dataFiltered[item.study_id] = (dataFiltered[item.study_id] || 0) + 1
    });
  }
  
  if(canvasid == 'countryChart'){
    newArray.forEach( item => {
      dataFiltered[item.country] = (dataFiltered[item.country] || 0) + 1
    });
  }
  
  var newFiltered = convertToArrObj(dataFiltered);
  if(canvasid == 'countryChart'){
    newFiltered.sort( (a, b) => parseFloat(b.frequency) - parseFloat(a.frequency))
  }
  
	var name = _.pluck(newFiltered, 'name');
  var frequency = _.pluck(newFiltered, 'frequency');
  console.log(frequency);
  
  if(canvasid == 'countryChart'){
    chart.data.labels = name;
  }
  
  chart.data.datasets[0].data = frequency;
  chart.update();
  
}

