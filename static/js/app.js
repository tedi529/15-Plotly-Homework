// Import and unpack data to build Bacteria Dashboard Visualization

// Import JSON data from data file
d3.json("static/data/samples.json").then(function(bSamples) { 
    console.log(bSamples)

    // Create dropdown menu function
    function loadDropdown(){
        let dropdownMenu = $("#selDataset");
        dropdownMenu.empty();

        dropdownMenu.prop('selectedIndex', 0);

        // Populate dropdown with test subject IDs
        $.each(bSamples.names, function (index, entry) {
            dropdownMenu.append($('<option></option>').attr('value', entry).text(entry));
        });
    };

    // Call updatePage() when a change takes place to the DOM (a new ID is selected)
    function updatePage(metadata, person) {
        
        // Creates individual metadata panel
        let metadataElement = d3.select("#sample-metadata");
        metadataElement.html("");
        Object.entries(metadata).forEach(([key, value]) =>{
            metadataElement.append('p').text(`${key} : ${value}`)
        });

        // Creates individual bar plot of ten most common bacteria 
        let barplotData = [{
            x: person.sample_values.slice(0,10).reverse(),
            y: person.otu_ids.slice(0,10).reverse(),
            marker: {color: "lightgreen"},
            type: "bar",
            orientation: "h",
            text: person.otu_labels
        }];

        let barLayout = {
            yaxis: {autorange: true,
            type: "category",
            title: "OTU ID"},
        }
        
        Plotly.newPlot("bar_chart", barplotData, barLayout, {responsive: true});

        // Creates individual bubble chart of ten most common bacteria 
        let bubbleplotData = [{
            x: person.otu_ids,
            y: person.sample_values,
            mode: "markers",
            marker: {
                size: person.sample_values,
                color: person.otu_ids},
                text: person.otu_labels
        }]

        let bubbleLayout = {
            xaxis: {title:"OTU ID"},
            yaxis: {title:"Quantity"},
        }

        Plotly.newPlot("bubble_chart", bubbleplotData, bubbleLayout, {responsive: true});

        // Creates gauge chart of weekly hand washing frequency of each person 
        let gaugeData = [
            {title: { text: "Belly Button Washing Frequency Per Week", font: { size: 24} },
            value: metadata.wfreq,
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                { range: [0, 1], color: "lightgray" },
                { range: [1, 2], color: "lightgray" },
                { range: [2, 3], color: "lightgray" },
                { range: [3, 4], color: "lightgray" },
                { range: [4, 5], color: "lightgray" },
                { range: [5, 6], color: "lightgray" },
                { range: [6, 7], color: "lightgray" },
                { range: [7, 8], color: "lightgray" },
                { range: [8, 9], color: "lightgray" }
                ],    
            }
            }
        ];
        
        let gaugeLayout = { width: 550, height: 400 };

        Plotly.newPlot('gauge', gaugeData, gaugeLayout, {response:true});

    };
    
    // Initialize the page with the default plot of the first individual
    function init(){
        let firstMetadata = bSamples.metadata[0];
        let firstSample = bSamples.samples[0];
        
        loadDropdown();
        updatePage(firstMetadata, firstSample);

        // Call updatePage() when a change takes place to the DOM
        d3.selectAll("#selDataset").on("change", function(){
            let metadata = bSamples.metadata.find(element => element.id == this.value);
            let person = bSamples.samples.find(element => element.id == this.value);
            
            updatePage(metadata, person);
        });
    };

    init();
});