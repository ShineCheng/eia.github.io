var motionFrames,ufoFrames,gui,effectController,willPos,startRot,gameData={status:"playing",failed_id:0,levelCount:0},gameMode=0,gameModeStrings=["NORMAL","NEVER FAILS","NEVER WIN"],ct=0,rtSpeed=0,orangeRange=100,emitPos=110,bulletHeight=50,isFire=!1,fireCount=0,slides=16,orangeRot=!0,speedRate=.4,hitTime=.7,fixRot=0,otString="",hitStep="",blurFilter=new PIXI.filters.BlurFilter,starsCounts=0,starsDensity=7,url=window.top.location.href,debugMode=!1;if(-1!=url.indexOf("?")){var gameModeStringIndex,lastIndex=url.indexOf("?");-1!=(gameModeStringIndex=url.indexOf("mode=0"))&&gameModeStringIndex>lastIndex&&(gameMode=0),-1!=(gameModeStringIndex=url.indexOf("mode=1"))&&gameModeStringIndex>lastIndex&&(gameMode=1),-1!=(gameModeStringIndex=url.indexOf("mode=2"))&&gameModeStringIndex>lastIndex&&(gameMode=2);var debugStringIndex=url.indexOf("debug=true");-1!=debugStringIndex&&debugStringIndex>lastIndex&&(debugMode=!0),url=url.substring(0,lastIndex)}var debugUrl=url+"?debug=true";console.log("%c DebugURL: "+debugUrl+" ","background: #bada55; color: #222"),debugMode&&(console.log("%c Mode [NORMAL]: "+url+"?mode=0&debug=true ","background: #333; color: #888"),console.log("%c Mode [NEVER FAILS]: "+url+"?mode=1&debug=true ","background: #333; color: #888"),console.log("%c Mode [NEVER WIN]: "+url+"?mode=2&debug=true ","background: #333; color: #888")),console.log("%c DebugMode: %c"+debugMode+" %c ","background: #0000b5; color: #ccc","background: #0000b5; color: #fff","background: #0000b5; color: #ccc"),console.log("%c GameMode: %c"+gameModeStrings[gameMode]+" %c ","background: #0000b5; color: #ccc","background: #0000b5; color: #fff","background: #0000b5; color: #ccc"),$(function(){switch(gameMode){case 0:gameData.levelCount=slides-8,$(".popup-start-game .tip").html("<p>正常模式</p>"),$(".popup-start-game").addClass("mode-normal"),$(".popup-end-game").addClass("mode-normal");break;case 1:gameData.levelCount=slides-3,$(".popup-start-game .tip").html("<p>Tips: 此模式不會失敗，可能會看出破綻</p>"),$(".popup-start-game").addClass("mode-never-fails"),$(".popup-end-game").addClass("mode-never-fails");break;case 2:gameData.levelCount=slides-6,$(".popup-start-game .tip").html("<p>Tips: 此模式一定不會過關</p>"),$(".popup-start-game").addClass("mode-never-win"),$(".popup-end-game").addClass("mode-never-win")}$(".ui-bullets .bullets-count .current-counts").html(gameData.levelCount),$(".ui-bullets .bullets-count .total-counts").html(gameData.levelCount);for(var e="",a=0;a<gameData.levelCount;a++)e+='<div class="bullet"></div>';$(".bullets").html(e),$(".btn-start").click(function(){gameData.status="playing",gameData.failed_id=0,$(".popup-start-game").fadeOut()}),$(".btn-retry, .btn-play-again").click(function(){removeSlides(),gameData.status="playing",gameData.failed_id=0,$(".popup-end-game").fadeOut()}),$(".btn-normal").click(function(){window.top.location.href=url+"?mode=0"}),$(".btn-never-fails").click(function(){window.top.location.href=url+"?mode=1"}),$(".btn-never-win").click(function(){window.top.location.href=url+"?mode=2"}),1==debugMode&&($(".popup-start-game").hide(),gameData.status="playing",gameData.failed_id=0),orangeRot=!0,gui&&(effectController.AutoRotate=!0,gui.__controllers[0].updateDisplay())});var posData=[];PIXI.utils.skipHello();var app=new PIXI.Application(800,600,{backgroundColor:1064});document.body.appendChild(app.view);var orangeContainer=new PIXI.Container;app.stage.addChild(orangeContainer);var fixContainer=new PIXI.Container;orangeContainer.addChild(fixContainer);var orange=PIXI.Sprite.fromImage(debugMode?"assets/moon2.png":"assets/moon.png");orange.anchor.set(.5),orange.scale.x=orange.scale.y=.315,fixContainer.addChild(orange);var hitBullets=new PIXI.Graphics;fixContainer.addChild(hitBullets);var orangeHit=new PIXI.Graphics;orangeHit.beginFill(153,.3),orangeHit.drawCircle(0,0,orangeRange),orangeHit.endFill(),fixContainer.addChildAt(orangeHit,0);var gameHit=new PIXI.Graphics;drawGameHit(),gameHit.x=.5*app.renderer.width,gameHit.y=.5*app.renderer.height,app.stage.addChild(gameHit);var starsContainer=new PIXI.Container;buildStars(),starsContainer.x=.5*app.renderer.width,starsContainer.y=.5*app.renderer.height,app.stage.addChild(starsContainer);for(var i=0;i<slides;i++)posData[i]=!1;function onAssetsLoaded(){motionFrames=[];for(var e=0;e<2;e++){var a=PIXI.Texture.fromFrame("motion"+e+".png");motionFrames.push(a)}PIXI.loader.add("spritesheet_ufo","ufo.json?v=2").load(onAssetsUFOLoaded)}function onAssetsUFOLoaded(){ufoFrames=[];for(var e=0;e<7;e++){var a=PIXI.Texture.fromFrame("ufo"+e+".png");ufoFrames.push(a)}(shuttle=new PIXI.extras.AnimatedSprite(ufoFrames)).anchor.set(.5,1),shuttle.y=bulletHeight+45,shuttle.animationSpeed=.2,shuttle.stop(),shuttle.onLoop=function(){shuttle.stop()},shuttle.onFrameChange=function(){},emitContainer.addChild(shuttle)}function showPosData(){otString="";for(var e=0;e<slides;e++)otString+="pos"+e+": "+(1==posData[e]?"o":"-")+"<br>";otString+=hitStep,$(".ot").html(otString)}function getHitPos(e){for(var a=ct,t=0;e-- >=0;)a+=.01,t+=.1*Math.sin(a)*speedRate;return t}showPosData(),PIXI.loader.add("spritesheet","motion.json").load(onAssetsLoaded),app.ticker.add(function(e){if(1==orangeRot){ct+=.01,rtSpeed=.1*Math.sin(ct)*speedRate,orangeContainer.rotation+=rtSpeed;var a=orangeContainer.rotation/(Math.PI/180);a=.1*Math.round(10*a)}shuttle&&(shuttle.y=16*Math.sin(ct)+bulletHeight+45+8)});var shuttle,emitContainer=new PIXI.Container;app.stage.addChild(emitContainer);var emitSp=new PIXI.Graphics;emitSp.beginFill(16711680,0),emitSp.drawRect(-50,-50,100,100),emitSp.endFill(),emitContainer.addChild(emitSp),app.stage.interactive=!0,app.stage.buttonMode=!0,app.stage.on("pointerup",fire);var bullet=new PIXI.Container;bulletGrphic=PIXI.Sprite.fromImage("assets/bunny.png"),bulletGrphic.anchor.set(.5,1),bulletGrphic.rotation=Math.PI/180*180,bullet.addChild(bulletGrphic);var bulletHit=new PIXI.Graphics;function buildStars(){starsContainer.removeChildren(),starsCounts=app.renderer.width/100*(app.renderer.height/100)*starsDensity;for(var e=0;e<starsCounts;e++){var a=PIXI.Sprite.fromImage("assets/starlight.png");a.anchor.set(.5),a.alpha=.5*Math.random();var t=.5*Math.random();a.x=app.renderer.width*(Math.random()-.5),a.y=app.renderer.height*(Math.random()-.5),a.scale.x=a.scale.y=t,starsContainer.addChild(a),TweenMax.to(a,.8,{delay:3*Math.random(),repeatDelay:3*Math.random(),alpha:0,yoyo:!0,repeat:-1,ease:Linear.easeNone})}}function fire(e){var a=-1*(emitContainer.y-orangeContainer.y-orangeRange);if(0==isFire){if(fireCount>=gameData.levelCount)return void(debugMode&&console.log("-- ERR --"));if("failed"==gameData.status)return void(debugMode&&console.log("-- END FAILED --"));debugMode&&console.log("-- FIRE --"),fireCount++,debugMode&&console.log("fireCount: "+fireCount);var t="",o=gameData.levelCount-fireCount;$(".ui-bullets .bullets-count .current-counts").html(o);for(var n=0;n<o;n++)t+='<div class="bullet"></div>';$(".bullets").html(t),TweenMax.to(bullet,hitTime,{y:a,ease:Linear.easeNone,onStart:function(){debugMode&&console.log("- ON_START -"),isFire=!0;var e=60*hitTime;debugMode&&console.log("FPS: "+app.ticker.FPS),debugMode&&console.log("hitTime: "+hitTime+"s"),debugMode&&console.log("willStopFrame: "+e),startRot=orangeContainer.rotation,willPos=startRot+getHitPos(e),debugMode&&console.log("> willPos: 弧度"+willPos),debugMode&&console.log("> willPos: 角度"+willPos/(Math.PI/180));var a=Math.round(willPos/(Math.PI/180)/(360/slides));debugMode&&console.log("origin hitSl: "+a);var t=a%slides;if(t<0&&(t+=slides),t>=slides&&(t-=slides),0==posData[t])debugMode&&console.log("%c Do not fix hitSl "+a+" ","background: #bada55; color: #222"),a%slides<0?posData[a%slides+slides]=!0:posData[a%slides]=!0,hitStep+=" > "+a%slides;else switch(debugMode&&console.log("Origin hitSl: "+a),gameMode){case 0:gameData.status="failed",gameData.failed_id=t,hitStep+="<span class='highlight'> > "+t+"</span>",debugMode&&console.log("%c Failed ID: "+gameData.failed_id+" ","background: #F00; color: #222");break;case 1:for(var o=Math.ceil(.5*slides),n=0;n<o;n++){if(i=a,i=a+n+1,(i%=slides)>=slides&&(i-=slides),debugMode&&console.log("Next: "+i+" "+posData[i]),i=a,(i=a-n-1)<0&&(i+=slides),debugMode&&console.log("Prev: "+i+" "+posData[i]),i=a,i=a+n+1,(i%=slides)>=slides&&(i-=slides),0==posData[i]){posData[i]=!0,hitStep+=" > "+i,a=a+n+1,debugMode&&console.log("%c Fix hitSl "+a+" ","background: #bada55; color: #222");break}if(i=a,i=a-n-1,(i%=slides)<0&&(i+=slides),0==posData[i]){posData[i]=!0,hitStep+=" > "+i,a=a-n-1,debugMode&&console.log("%c Fix hitSl "+a+" ","background: #bada55; color: #222");break}}break;case 2:gameData.status="failed",gameData.failed_id=t,hitStep+="<span class='highlight'> > "+t+"</span>",debugMode&&console.log("%c Failed ID: "+gameData.failed_id+" ","background: #F00; color: #222")}if(2==gameMode&&gameData.levelCount-fireCount<1)for(o=Math.ceil(.5*slides),n=0;n<o;n++){var i;if(i=a,i=a+n+1,(i%=slides)>=slides&&(i-=slides),debugMode&&console.log("Next: "+i+" "+posData[i]),i=a,(i=a-n-1)<0&&(i+=slides),debugMode&&console.log("Prev: "+i+" "+posData[i]),i=a,i=a+n+1,(i%=slides)>=slides&&(i-=slides),1==posData[i]){a=a+n+1,debugMode&&console.log("%c Fix hitSl "+a+" ","background: #bada55; color: #222"),gameData.status="failed",gameData.failed_id=a,hitStep+="<span class='highlight'> > "+a+"</span>",debugMode&&console.log("%c Failed ID: "+gameData.failed_id+" ","background: #F00; color: #222");break}if(i=a,i=a-n-1,(i%=slides)<0&&(i+=slides),1==posData[i]){posData[i]=!0,hitStep+=" > "+i,a=a-n-1,debugMode&&console.log("%c Fix hitSl "+a+" ","background: #bada55; color: #222"),gameData.status="failed",gameData.failed_id=a,hitStep+="<span class='highlight'> > "+a+"</span>",debugMode&&console.log("%c Failed ID: "+gameData.failed_id+" ","background: #F00; color: #222");break}}showPosData(),debugMode&&console.log("hitSl: "+a),hitSlRot=a*(360/slides),debugMode&&console.log("hitSlRot: 角度"+hitSlRot),fixRot=hitSlRot-willPos/(Math.PI/180),TweenMax.to(fixContainer,hitTime,{rotation:fixRot*(Math.PI/180),ease:Linear.easeNone})},onComplete:function(){debugMode&&console.log("- ON_COMPLETE -"),this.target.alpha=0;var e=new PIXI.Container;hitBullets.addChildAt(e,0);var a=new PIXI.extras.AnimatedSprite(motionFrames);a.anchor.set(.5,1),a.rotation=Math.PI/180*180,a.y=orangeRange,a.animationSpeed=.03,a.gotoAndPlay(1),e.addChildAt(a,0);var t=new PIXI.Graphics;t.beginFill(16711680,0),t.drawRect(-10,orangeRange,20,bulletHeight),t.endFill(),e.addChildAt(t,0),e.rotation=-1*orangeContainer.rotation,e.rotation-=fixRot*(Math.PI/180),debugMode&&console.log("> launchContainer.rotation: 角度"+e.rotation/(Math.PI/180)),fireCount==gameData.levelCount?($(".popup-end-game .title").html("<p>過關</p>"),endGame()):(TweenMax.set(bullet,{y:15,alpha:0}),TweenMax.to(bullet,.2,{y:0,alpha:1,ease:Strong.easeOut,onStart:function(){isFire=!1}})),"failed"==gameData.status&&($(".popup-end-game .title").html("<p>遊戲結束</p>"),endGame(),failedMotion()),shake()}})}}function endGame(){debugMode&&console.log("-- END --"),"failed"==gameData.status?($(".popup-end-game .popup-text").removeClass("failed"),$(".popup-end-game .popup-text").removeClass("success"),$(".popup-end-game .popup-text").addClass("failed")):($(".popup-end-game .popup-text").removeClass("failed"),$(".popup-end-game .popup-text").removeClass("success"),$(".popup-end-game .popup-text").addClass("success")),$(".popup-end-game").delay(300).fadeIn()}function shake(){}function shakeComplete(){console.log("shakeComplete"),orangeContainer.filters=[]}function failedMotion(){for(var e=hitBullets.children.length,a=0;a<e;a++){var t=hitBullets.children[a].children[1];t.gotoAndStop(0),TweenMax.to(t,.2,{delay:.3*Math.random(),yoyo:!0,repeat:-1,y:t.y+20,ease:Strong.easeOut})}orangeRot=!1,gui&&(effectController.AutoRotate=!1,gui.__controllers[0].updateDisplay())}function rotChange(){orangeRot=effectController.AutoRotate}function speedChange(){speedRate=effectController.SpeedRate}function removeSlides(){gameData.status="playing",gameData.failed_id=0,hitStep="",isFire=!1,hitBullets.removeChildren(),fireCount=0,otString="";for(var e="",a=0;a<gameData.levelCount;a++)e+='<div class="bullet"></div>';for(a=0;a<slides;a++)posData[a]=!1;showPosData(),$(".bullets").html(e),$(".ui-bullets .bullets-count .current-counts").html(gameData.levelCount),$(".ui-bullets .bullets-count .total-counts").html(gameData.levelCount),TweenMax.set(bullet,{y:30,alpha:0}),TweenMax.to(bullet,.1,{y:0,alpha:1,ease:Strong.easeOut}),orangeRot=!0,gui&&(effectController.AutoRotate=!0,gui.__controllers[0].updateDisplay())}function drawGameHit(){gameHit.clear(),gameHit.beginFill(16750848,0),gameHit.drawRect(-.5*app.renderer.width,-.5*app.renderer.height,app.renderer.width,app.renderer.height),gameHit.endFill()}bulletHit.beginFill(16711680,0),bulletHit.drawRect(-10,0,20,bulletHeight),bulletHit.endFill(),bullet.addChildAt(bulletHit,0),emitContainer.addChild(bullet),debugMode&&($(".ot").css("display","block"),gui=new dat.GUI,effectController={AutoRotate:!0,Reset:removeSlides,SpeedRate:speedRate},gui.add(effectController,"AutoRotate").onChange(rotChange),gui.add(effectController,"SpeedRate",0,3,.01).onChange(speedChange),gui.add(effectController,"Reset")),window.onresize=function(e){var a=window.innerWidth,t=window.innerHeight;app.view.style.width=a+"px",app.view.style.height=t+"px",app.renderer.resize(a,t),orangeContainer.x=.5*app.renderer.width,orangeContainer.y=.5*app.renderer.height-100,emitContainer.x=.5*app.renderer.width,emitContainer.y=.5*app.renderer.height+emitPos,drawGameHit(),gameHit.x=.5*app.renderer.width,gameHit.y=.5*app.renderer.height,buildStars(),starsContainer.x=.5*app.renderer.width,starsContainer.y=.5*app.renderer.height},onresize();