var dataDiv = document.getElementById('dataDiv');
var arrayDates=[];
var arrayRates=[];
var substrings = ['AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HRK','HUF','IDR','ILS','INR','JPY','KRW','LTL','MXN','MYR','NOK','NZD','PHP',
                  'PLN','RON','RUB','SEK','SGD','THB','TRY','USD','ZAR'];
   //podporovane meny




function myf(data){

  arrayRates.reverse();
  arrayDates.reverse();
  var myChart = document.getElementById('myChart').getContext('2d');
      var sobota="sobota";
      var kurz=25.01;
      var massPopChart = new Chart(myChart,{
        type:'line', //bar, horizontalBar, pie,line, doughnut, radar
        data:{
          labels:arrayDates,
          datasets:[{
            label:'Kurz',
            data:arrayRates
          }]
        },
        options:{
          title:{
            display:true,
            text:'Hodnoty kurzu',
            fontSize:25
          },
          legend:{
            display:false,
            position:'right',
            labels:{
              fontColor:'#000'
            }
          },
          layout:{
            padding:{
              left:50,
              right:0,
              bottom:0,
              top:0
            }
          }
        }
      });

      arrayDates=[];
      arrayRates=[];

}




/*
faskfhdsiogvdsnvksdvndsl


*/

















function f() {
  $.get("http://www.apilayer.net/api/live?access_key=a05eaa098594d47273aca60b0dc56091&currencies=PLN&format=1", function(data, status) {
    renderHTML(data);
  });
}

function renderHTML(data) {
  var valuesOfQuotes = new Array();
  var valuesOfQuotesOnly = new Array(); // uz iba cista hodnota bez akychkolvek znakov
  var myQuotes = JSON.stringify(data.quotes);
  var splitMyQuotes = myQuotes.split(",");


  for (var i = 0; i < splitMyQuotes.length; i++) {
    valuesOfQuotes.push(splitMyQuotes[i].split(":")[1]);
  }


  for (var i = 0; i < valuesOfQuotes.length; i++) {
    valuesOfQuotesOnly.push(parseFloat(valuesOfQuotes[i]));
  }

  //console.log(valuesOfQuotesOnly);
  /*
    for (var i = 0; i < valuesOfQuotes.length; i++) {
        $('#dataDiv').append( "<p>"+valuesOfQuotes[i]+"</p>" );
    }
  */

}




//----------------------------------------- Ponuka mien v dropdowne ------------------------
function fillDropDown(){
  $.get("http://apilayer.net/api/list?access_key=a05eaa098594d47273aca60b0dc56091", function(data, status){
        renderHTMLDropDown(data);
    });
}







function renderHTMLDropDown(data){
  var valuesOfQuotes = new Array();
  var myQuotes = JSON.stringify(data.currencies);
  var deleteFirstAndLastCharacter = myQuotes.substring(1, myQuotes.length-1);
  var splitMyQuotes = deleteFirstAndLastCharacter.split(",");


  for (var i = 0; i < splitMyQuotes.length; i++) {
    var deleteQuotes = splitMyQuotes[i].replace(/['"]+/g, ''); //zmazanie uvodzoviek

    length = substrings.length;
    while(length--) {
      if (deleteQuotes.indexOf(substrings[length])!=-1) {
        valuesOfQuotes.push(deleteQuotes); //odfiltrovanie nepodporovanych mien
      }
    }
  }


  $.each(valuesOfQuotes, function(index, value) {
     $('#sel1').append($('<option>').text(value).attr('value', index)); //naplnenie prveho dropdownu
     $('#sel2').append($('<option>').text(value).attr('value', index)); //naplnenie druheho dropdownu
   });


}

//-----------------------------------------Koniec Ponuka mien v dropdowne ------------------------






function readDropdown1(){
  var position =$('#sel1').val();
  var currencyFullText = $("#sel1 option[value=" + position  + "]").text();
  var currencyCode= currencyFullText.substring(0, 3);
  //console.log("currencyCode "+currencyCode);
  return currencyCode;
}


function readDropdown2(){
  var position =$("#sel2").val();
  var currencyFullText = $("#sel2 option[value=" + position  + "]").text();
  var currencyCode= currencyFullText.substring(0, 3);
  //console.log("currencyCode "+currencyCode);
  return currencyCode;
}



//----OANDA API
function getOANDA() {
var dates= dateF();
  for (var i = 0; i < 7; i++) {
    var part1="https://www.oanda.com/rates/api/v1/rates/";
    var findBaseCurrency = readDropdown1();
    var baseCurrency=""+findBaseCurrency;
    var part2=".json?api_key=GWy1Qa8T0e69jMpulrrAzWoM&decimal_places=all&date=";
    var date = dates[i];
    console.log("Toto prislo z today .. je to den c."+i+" a datum"+date);
    var part3="&data_set=ecb&fields=averages&fields=highs&quote=";
    var findCurrency = readDropdown2();
    var currency=""+findCurrency;

    var final = part1+baseCurrency+part2+date+part3+currency;



    $.get({
      url: final,// mandatory
      success:function(data, status) {
        renderHTMLoanda(data);
      },
      async:false // to make it synchronous
    });
/*
    $.get(final, function(data, status) {
      renderHTMLoanda(data);
    });
*/

  }

  alert("Data ziskane mozete vytvorit graf.");

}



function renderHTMLoanda(data) {
 var skuska = readDropdown2();
  var baseCurrency = data.base_currency;
  var kurz = data.quotes[skuska].spot;
  var date = data.quotes[skuska].date;
  //console.log("Kurz "+baseCurrency+" na "+skuska+" je "+ kurz);
  //console.log("Datum je "+ date);

  var transferD = date.slice();
  var parsingDate = transferD.substring(0, 10);
  arrayDates.push(parsingDate);

  var transferR = kurz.slice();
  arrayRates.push(transferR);
  console.log("Renderovane datumy "+date +"kurz "+kurz);





  //var datum = JSON.stringify(data.quotes.CZK.date)

}





function formatDate(date){

   var dd = date.getDate();
   var mm = date.getMonth()+1;
   var yyyy = date.getFullYear();
   if(dd<10) {dd='0'+dd}
   if(mm<10) {mm='0'+mm}
   date = yyyy + '-' + mm + '-' + dd;
   return date;
}


function dateF () {
    var result = [];
    for (var i=0; i<7; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push(formatDate(d));
    }
    return result;
    //return(result.join(','));
}


/*
function dateF(){


  var today = new Date();
  var dd1 = today.getDate();
  var dd2 = today.getDate()-1;
  var dd3 = today.getDate()-2;
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd1<10) {
      dd1 = '0'+dd1
  }

  if(dd2<10) {
      dd2 = '0'+dd2
  }

  if(dd3<10) {
      dd3 = '0'+dd3
  }

  if(mm<10) {
      mm = '0'+mm
  }
  today = yyyy + '-' + mm + '-' + dd1;
  yesterday = yyyy + '-' + mm + '-' + dd2;
  yesteday = yyyy + '-' + mm + '-' + dd3;
  console.log(today);
  console.log(yesterday);
  console.log(yesteday);
  //return today;
}
*/
