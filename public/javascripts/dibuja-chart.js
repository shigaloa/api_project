google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    $.get('/datos_grafico', function(response) {
        console.log(response);
        var linea = [];
        var chartData = [];
        var numero_series = response.length;
        var numero_anyos = response[0].Data.length;
        var comunidad = response[0].Nombre.split(".")[0]
        
        var data = new google.visualization.DataTable();
        
        data.addColumn('number', 'Año');
        
        for (var i = 0; i < numero_series; i++){
          console.log('Nombre: ', response[i].Nombre);
          if (response[i].Nombre.indexOf("Hombres") < 0 && response[i].Nombre.indexOf("Mujeres") < 0){
            data.addColumn('number', 'Todos');
          } else if (response[i].Nombre.indexOf("Mujeres") < 0){
            data.addColumn('number', 'Hombres');
          } else {
            data.addColumn('number', 'Mujeres');
          }
        }
        
        for (i = numero_anyos -1; i >= 0; i--) {
          linea = [];
          linea.push (response[0].Data[i].Anyo);
          for (var j = 0; j < numero_series; j++){
            linea.push (response[j].Data[i].Valor); 
          };
          chartData[i] = linea;
          console.log('chartData: ', chartData);
          console.log('linea: ',linea);
          };

        data.addRows(chartData);

        
        var options = {
          chart: {
            title: 'Cifras oficiales de población ' + comunidad,
            subtitle: 'Fuente: Instituto Nacional de Estadística'
          },
          width: 900,
          height: 400, //500,
          hAxis: {
            format: '#,###',
            //viewWindowMode:  'maximized',
          },
          vAxis: {
            format: '##,###,###'
          }
        };

      var chart = new google.charts.Line(document.getElementById('grafico_lineal'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }, 'json');
}