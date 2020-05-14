var jsonData;

d3.json('data/samples.json').then(data => {
    jsonData = data;

    var names = data.names;
    names.forEach(name => {
        d3.select('select').append('option').text(name).attr('value',name)
    });
    showPanel(names[0]);
    showBar(names[0]);
    showBubble(names[0]);
    var metadata = data.metadata.filter(obj => obj.id == names[0])[0];
    showGauge(metadata.wfreq)
});

function showPanel(name) {
    d3.json('data/samples.json').then((data => {
        var metadata = data.metadata.filter(obj => obj.id == name)[0];
        var panel = d3.select('.panel-body');
        panel.html('');

        Object.entries(metadata).forEach(([key,value])=> {
            panel.append('h4').text(`${key.toUpperCase()}: ${value}`)
        });
    }));
};

function optionChanged(name) {
    showPanel(name);
    showBar(name);
    showBubble(name);
    showGauge(name);
};

function showBar(name) {
    d3.json('data/samples.json').then(data => {
       var sample = data.samples.filter(obj => obj.id == name)[0];
       var bar = d3.select("#bar");
       bar.html('');

       var barData = [
           {
               y: sample.otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
               x: sample.sample_values.slice(0,10).reverse(),
               type: 'bar',
               orientation: 'h'
           }
       ];

       var barLayout = {
           title: 'Top 10 Bacteria Cultures Found',
           margin: {t: 40, l: 150}
       };

       Plotly.newPlot('bar', barData, barLayout)
    });
};

function showBubble(name) {
    d3.json('data/samples.json').then(data => {
        var sample = data.samples.filter(obj => obj.id == name)[0];
        var bubble = d3.select("#bubble");
        bubble.html('');
 
        var bubbleData = [
            {
                x: sample.otu_ids,
                y: sample.sample_values,
                text: sample.otu_labels,
                mode: 'markers',
                marker: {
                    size: sample.sample_values,
                    color: sample.otu_ids,
                    colorscale: 'Earth'
                }
            }
        ];
 
        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            margin: {t: 0},
            hovermode: 'closest',
            xaxis: { title: 'OTU ID'},
            margin: { t: 30}
        };
 
        Plotly.newPlot('bubble', bubbleData, bubbleLayout)
     });
};