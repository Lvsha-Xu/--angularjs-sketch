var app=angular.module('sketch', []);
app.controller('sketchController', ['$scope', function($scope){
	$scope.canvasWH={width:650,height:430}
	var canvas=document.querySelector('#sketch');
	var ctx=canvas.getContext('2d');
	var previous;//截取（getImageData）并保存（putImageData）之前画的图案
	var setmousemove={
		line:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
				if(previous){
					ctx.putImageData(previous,0,0);//getImageData
				}
				ctx.beginPath();//线
				ctx.moveTo(e.offsetX+0.5,e.offsetY+0.5);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		pencil:function(e){				
			ctx.beginPath();//线
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove=function(ev){
				ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
				if(previous){
					ctx.putImageData(previous,0,0);//getImageData
				}
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		arc:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();//圆
				var r=Math.abs((ev.offsetX-e.offsetX)/2);
				ctx.arc(e.offsetX+r,e.offsetY+r,r,0,Math.PI*2);//顺时针
				if($scope.csState.style=="fill"){
					ctx.arc(e.offsetX+r,e.offsetY+r,r,0,Math.PI*2);//顺时针
					ctx.fill();

				}else{
					ctx.arc(e.offsetX+r,e.offsetY+r,r,0,Math.PI*2);//顺时针
					ctx.stroke();
				}
			}
		},	
		rect:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();//canvas中关于矩形及边框的
				var rectX=ev.offsetX-e.offsetX;
				var rectY=ev.offsetY-e.offsetY;
				//判断是填充还是画线
				if($scope.csState.style=="fill"){
						ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,rectX,rectY);//前两个为位置，后两个为大小
						ctx.fill();
					}else{
					ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,rectX,rectY);//前两个为位置，后两个为大小
					ctx.stroke();
				}
			}
		},	
		erase:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(ev.offsetX,ev.offsetY,20,20);
			}
		}
	}
	$scope.tool='line';
	$scope.tools={//工具
		'画线':'line', '画圆':'arc', '矩形':'rect',
		'铅笔':'pencil','橡皮':'erase', '选择':'select'
	}
	$scope.settool=function(tool){
		$scope.tool=tool;
	}
	//填充、画线、线宽度
	$scope.csState={
		fillStyle:'#000000',
		strokeStyle:'#000000',
		lineWidth:1,
		style:'stroke'
	}
	$scope.setStyle=function(s){
		$scope.csState.style=s;
	}
	$scope.newSketch=function() {
		if(previous){
			if(confirm('是否保存')){
				location.href=canvas.toDataURL();
			}
		}
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
		previous=null;
	}
	$scope.save=function(ev){
		if(previous){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download='mypic.png';
		}else{
			alert('空画布');
		}
		
	}
	///方式1   保存下载当前状态，格式为png,用户
	var link = document.createElement('a');
	link.innerHTML = 'download image';
	link.addEventListener('click', function(ev) {
		link.href = canvas.toDataURL();
		link.download = "mypainting.png";
	}, false);
	document.body.appendChild(link);
	canvas.onmousedown=function(e){
		ctx.strokeStyle=$scope.csState.strokeStyle;
		ctx.fillStyle=$scope.csState.fillStyle;
		ctx.lineWidth=$scope.csState.lineWidth;
		setmousemove[$scope.tool](e);
		document.onmouseup=function(){
			canvas.onmousemove=null;
			canvas.onmouseup=null;
			previous=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);//截图
		}
	}
}])