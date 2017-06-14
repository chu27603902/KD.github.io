window.addEventListener("load", function() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
      kd();
    }
})
//---------------------------------
function kd(event) {
  var a = event.target;
  var b = new FileReader();
  var c;
  b.onload = function(){
    var d = [];
    var e = document.getElementById('output');
    d = b.result;
    //原始資料由字串轉陣列
    c = StrToAry(d);
    //計算移動平均: 參數1為原始資料、參數2為天數、參數數3為新增列數

    //計算RSV=100*(第N天收盤價-近N日內最低價)/(近N日內最高價-近N日內最低價)
    //先找每9日的最高價和最低價
    var j = []; //近9天收盤價
    var k = []; //最高價
    var s = []; //最低價
    var RSV = [];
    var l; var m; var n;  //最高
    var p; var q; var r;  //最低
    var tuy; var ff = [];

    for (o=84; o>7; o=o-1) {
    	for (h=0; h<9; h++) {
    		l = j.push(num[4][o-h]);
    		m = j.sort();
    	}
    		n = k.push(j[h-1]);
    		j = [];
    }

    for (o=84; o>7; o=o-1) {
    	for (h=0; h<9; h++) {
    		p = j.push(num[4][o-h]);
    		q = j.sort();
    	}
    		r = s.push(j[h-9]);
    		j = [];
    }
    //alert(k.length)-76
    //console.log("k = " + k);
    //alert(s.length)
    //console.log("s = " + s);
    
    //計算RSV...//計算RSV=100*(第N天收盤價-近N日內最低價)/(近N日內最高價-近N日內最低價)
    var t; var v; var w; var x; var y; var z = 0;

    for (o=84; o>7;o--) {
    	for (u=0; u<(k.length+2); u++) {
    		t = num[4][o]-s[z];
    		v = k[z]-s[z]; 
    		w = (t/v)*100;
    		y = w.toFixed(4);
    		if (y>100) {
    			y = 100;
    			x = RSV.push(y);
    		}else if (y<0) {
    			y = 0;
    			x = RSV.push(y);
    		}else{
    		x = RSV.push(y);
    		}
    		z=z+1
    		break    		
    	}
    }
    	//console.log("RSV = " + RSV);
    	//alert(RSV.length)-77

    //求KD線
    var KLi = [];var DLi = []; var bb; var cc; var dd = 76;
    for (aa=0; aa<76; aa++) {
    	if (aa==0) {
    		KLi.push(50);
    		DLi.push(50);
    		KL = (RSV[dd]*(1/3))+((2/3)*KLi[aa]);
    		bb = KLi.push(KL.toFixed(4));
    		DL = ((1/3)*KLi[aa+1])+((2/3)*DLi[aa]);
    		cc = DLi.push(DL.toFixed(4));
    		dd = dd-1;
    	}else{
    		KL = (RSV[dd]*(1/3))+((2/3)*KLi[aa]);
    		bb = KLi.push(KL.toFixed(4));
    		DL = ((1/3)*KLi[aa+1])+((2/3)*DLi[aa]);
    		cc = DLi.push(DL.toFixed(4));
    		dd = dd-1;
    	}
    }
    //console.log("KLi = " + KLi);
    //console.log("DLi= " + DLi);
   

    //畫走勢圖
    judgemark = judge(num,KLi,DLi);

    drawplot(num,KLi,DLi,judgemark);
  }
  b.readAsText(a.files[0]);
}
//將原始資料由字串-陣列
function StrToAry(f) {
  var g = f.split('\n');
  var row = g.length-1;
  var col = 150;
  num = new Array(row);
  for (i = 0; i < row; i++) {
    if (i == 0) {
      g[i]=g[i].replace(/\//g,"-");
      num[i] = new Array(col);
      num[i] = g[i].split("\t");
    } else {
        num[i] = new Array(col);
        num[i] = g[i].split('\t');
    }
  }
  //alert(num[0].length)-85
}

function  judge(Num,K,D){
	var A = Num[0].length; //85
	var Buy01 = [];
	var Buy02 = [];
	var Buy03 = [];
	var Price01 = [];
	var Sell01 = [];
	var Sell02 = [];
	var Sell03 = [];
	var Price02 = [];
	var J = 0; var O = 0; var B = 0; var S = 0;var E; var F;var G; var H;
	var flag = false;
	var roi = [];
	var sum = 0;
	var result = new Array(4);
	for (i=0; i<A; i++) {

		//判斷K>D線+K上升=買進  當D值小於30且K值線由下往上穿過D值線時為買進訊號。
		if ((D[i] < 30) && (K[i] < D[i]) && (K[i-1] < D[i-1]) && (flag == false) ) {
			Buy01[J] = Num[0][i+7];
			Buy02[J] = K[i];
			Buy03[J] = D[i];
			Price01[J] = Num[4][i+7]
			flag = true;
			J+=1;
			//console.log("Buy01 = " + Buy01);
			//console.log("Buy02 = " + Buy02);
			//console.log("Buy03 = " + Buy03);
			//console.log("Price01 = " + Price01);
		}

		//判斷K<D線+K下降=賣出  當D值大於70且K值線由上往下穿過D值線時為賣出訊號。
		if ((D[i] > 70) && (K[i] > D[i]) && (K[i-1] > D[i-1]) && (flag == true) ) {
			Sell01[O] = Num[0][i+7];
			Sell02[O] = K[i];
			Sell03[O] = D[i];
			Price02[O] = Num[4][i+7]
			flag = false;
			O+=1;
			//console.log("Sell01 = " + Sell01);
			//console.log("Sell02 = " + Sell02);
			//console.log("Sell03 = " + Sell03);
			//console.log("Price02 = " + Price02); 
		}
	}

	//最後一日，有買進但沒有賣出訊號時，以最後一天收盤價出場
	if ((flag == true) && (Price02.length < Price01.length)) {
    	Sell01[O] = Num[0][i];
    	Price02[O] = Num[4][i];
	}

//計算報酬率
	var ar; var af; var aj;
    for (i=0; i < Price02.length; i+=1) {
    	ar = Price02[i]-Price01[i];
    	af = ar/Price01[i];
    	aj = roi.push(af);
    	sum = (sum + af);
    }
    document.getElementById("roi").innerHTML = "累計報酬率 = " + ((sum*100)).toFixed(4) + "%";
    result[0] = Buy01;
    result[1] = Price01;
    result[2] = Sell01;
    result[3] = Price02;
    return result;

}
//走勢圖
function drawplot(Num,K,D,point){
	var col = Num[0].length;
 	//alert(Num[0])
 	//alert(K)
 	//alert(D)
 	//alert(point[0])
 	//alert(point[1])
 	//alert(point[2])
 	//alert(point[3])

  	var trace1 = {
    	type: 'scatter',
    	x: Num[0], 
    	y: K,
    	mode: 'lines',
    	name: 'K線', 
    	line: {
      	color: 'blue',
      	width: 1,
    	}
  	};

    var trace2 = {
    	type: 'scatter',
    	x: Num[0], 
    	y: D,
    	mode: 'lines',
    	name: 'D線', 
    	line: {
      	color: 'brown',
      	width: 1
    	} 
  	};

  	var trace3 = {
    	type: 'scatter',
    	x: Num[0], 
    	y: Num[4],
    	mode: 'lines',
    	name: '收盤價', 
    	line: {
     	 color: 'gray',
      	width: 1,
      	smoothing: 0
    	}
  	};

	var trace4 = {
 		x: point[0],
  		y: point[1],
  		mode: 'markers+text',
  		name: '買入點',
  		textposition: 'top',
 		 type: 'scatter',
  		marker: {
    		color: 'red',
    		size: 5,
    		symbol: 'square'
  		}   
	};

	var trace5 = {
  		x: point[2],
  		y: point[3],
  		mode: 'markers+text',
  		name: '賣出點',
  		textposition: 'top',
 		 type: 'scatter',
 		 marker: {
    		color: 'Black',
    		size: 5,
    		symbol: 'cross'
  		} 
	};
  var data = [trace1, trace2, trace3, trace4, trace5];
  var layout = {
    dragmode: 'zoom', 
    width: 800,
    height: 800,
    showlegend: true, 
    xaxis: {
      autorange: true, 
      domain: [0, 1], 
      range: ['2017-02-02', '2017-06-07'], 
      rangeslider: {range: ['2017-02-02', '2017-06-07']}, 
      title: 'Date', 
      type: 'date'
    }, 
    yaxis: {
      autorange: true, 
      domain: [0, 1], 
      range: [150, 200], 
      type: 'linear'
    }
  };
  Plotly.plot('output', data, layout);
}