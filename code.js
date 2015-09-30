var results = [];

function calc()
{
	results = [];
		
	var currentSavings = parseFloat($('#currentSavings').unmask());
	var annualSavings = parseFloat($('#annualSavings').unmask());
	
	// var inflation = parseFloat($('#inflation').unmask()) / 100;
	// var savingsIncrease = parseFloat($('#savingsIncrease').unmask()) / 100;	
	// var roi = parseFloat($('#roi').unmask()) / 100;
	
	var inflation = parseFloat($('#inflation').val());
	// var savingsIncrease = parseFloat($('#savingsIncrease').val());	
	var roi = parseFloat($('#roi').val());
	
	var incomeAtRetirement = parseFloat($('#incomeAtRetirement').unmask());	
	
	// var yearsOfRetirement = parseFloat(document.getElementById('yearsOfRetirement').value);
	var yearsOfWork = parseFloat(document.getElementById('yearsOfWork').value);	
	
	var local = [];
	local['thisYearSavings'] = 0;
	local['thisYearSpendings'] = 0;
	local['thisYearROI'] = 0;
	local['totalSavings'] = currentSavings;
	local['totalCapital'] = currentSavings;
	local['adjustedIncomeAtRetirement'] = incomeAtRetirement;
	
	local['totalCapitalIncome'] = local['thisYearROI'];
	
	results[0] = local;
	
	local = [];
	local['thisYearSavings'] = annualSavings;
	local['thisYearSpendings'] = 0;
	local['thisYearROI'] = currentSavings * roi;
	local['totalSavings'] = currentSavings;
	local['totalCapital'] = currentSavings + local['thisYearROI'] + local['thisYearSavings'];
	local['adjustedIncomeAtRetirement'] = incomeAtRetirement * (1+inflation);
	
	local['totalCapitalIncome'] = local['thisYearROI'];
	
	results[1] = local;
	
	for (i = 2; i <= yearsOfWork; i++) {
		var local = [];
		local['thisYearSavings'] = results[i-1]['thisYearSavings'] * (1+inflation);
		local['thisYearSpendings'] = 0;
		local['thisYearROI'] = results[i-1]['totalCapital'] * roi;
		local['totalSavings'] = results[i-1]['totalSavings'] + local['thisYearSavings'];
		local['totalCapital'] = results[i-1]['totalCapital'] + local['thisYearROI'] + local['thisYearSavings'];
		local['adjustedIncomeAtRetirement'] = results[i-1]['adjustedIncomeAtRetirement'] * (1+inflation);
		local['totalCapitalIncome'] = results[i-1]['totalCapitalIncome'] + local['thisYearROI'];
		
		results[i] = local;
	}
	
	var yearsOfRetirement = 0
	
	for (i = yearsOfWork+1; results[results.length -1]['totalCapital'] > 0 && yearsOfRetirement < 80 - yearsOfWork; i++) {
		yearsOfRetirement++;
		var local = [];
		local['adjustedIncomeAtRetirement'] = results[i-1]['adjustedIncomeAtRetirement'] * (1+inflation);
		local['thisYearSpendings'] = local['adjustedIncomeAtRetirement'];
		local['thisYearSavings'] = 0;
		local['totalSavings'] = results[i-1]['totalSavings'];
		local['thisYearROI'] = results[i-1]['totalCapital'] * roi;
		local['totalCapital'] = results[i-1]['totalCapital'] + local['thisYearROI'] - local['adjustedIncomeAtRetirement'];
		local['totalCapitalIncome'] = results[i-1]['totalCapitalIncome'] + local['thisYearROI'];
				
		results[i] = local;
	}
	
	var N = yearsOfWork+yearsOfRetirement;

	console.log(results);
	
	$('#graphContainer').highcharts({
        title: {
            text: 'Retirement Capital'
        },
        xAxis: {
			title: {
                text: 'Years'
            },
			allowDecimals: false,
            categories: Array.apply(null, {length: N}).map(Number.call, Number),
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            },
			plotBands: [{
                from: 0,
                to: yearsOfWork,
                color: '#FFE6E6',
                label: {
                    text: 'Work',
                    style: {
                        color: '#999999'
                    },
                    y: 100
                }
				}, {
                from: yearsOfWork,
                to: 1000,
                color: '#FCFFFB',
                label: {
                    text: 'Retirement',
                    style: {
                        color: '#999999'
                    },
                    y: 20
                }
            }
			],
		},
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return (this.value / 1000) + " k";
                }
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' '
        },
        plotOptions: {
            area: {
				marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Capital',
			type: 'area',
            data: results.map(function(obj){
				return Math.round(obj.totalCapital);
			})
        }, {
            name: 'Savings',
			type: 'column',
            data: results.map(function(obj){
				return Math.round(obj.thisYearSavings);
			})
        }, {
            name: 'Spendings',
			type: 'column',
            data: results.map(function(obj){
				return Math.round(obj.thisYearSpendings);
			})
        }, {
            name: 'Capital Income',
			type: 'column',
            data: results.map(function(obj){
				return Math.round(obj.thisYearROI);
			})
        }, {
            name: 'Cumulated Capital Income',
			type: 'line',
			lineWidth: 1,
			marker: {
                enabled: false
            },			
            data: results.map(function(obj){
				return Math.round(obj.totalCapitalIncome);
			}),
			visible: false
        }]
    });
}

document.getElementById('currentSavings').onchange = calc;
document.getElementById('annualSavings').onchange = calc;
document.getElementById('inflation').onchange = calc;
// document.getElementById('savingsIncrease').onchange = calc;
// document.getElementById('yearsOfRetirement').onchange = calc;
document.getElementById('roi').onchange = calc;
document.getElementById('yearsOfWork').onchange = calc;
document.getElementById('incomeAtRetirement').onchange = calc;

$('#currentSavings').priceFormat({
    prefix: '$ ',
    thousandsSeparator: ',',
	centsLimit: 0
});

$('#annualSavings').priceFormat({
    prefix: '$ ',
    thousandsSeparator: ',',
	centsLimit: 0
});

// $('#inflation').priceFormat({
	// prefix: '',
    // suffix: '% ',
	// centsLimit: 0
// });

// $('#savingsIncrease').priceFormat({
	// prefix: '',
    // suffix: '% ',
	// centsLimit: 0
// });

// $('#roi').priceFormat({
	// prefix: '',
    // suffix: '% ',
	// centsLimit: 0
// });

$('#incomeAtRetirement').priceFormat({
    prefix: '$ ',
    thousandsSeparator: ',',
	centsLimit: 0
});


// $(".percent").mask('##0.00%', {reverse: true});

$(".percent").on("blur", function() {
	var jObj = $(this);
	var jVal = jObj.val();
	jObj.val((jVal.length === 1) ? jVal + '%' : jVal);
});


calc();