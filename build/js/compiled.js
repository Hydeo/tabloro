"use strict";function slice(e,t,o){switch(arguments.length){case 0:throw"no args";case 1:return slice(e,0,e.length);case 2:return slice(e,t,e.length);default:for(var n=Math.max(0,o-t),r=new Array(n),i=-1;++i<n;)r[i]=e[t+i];return r}}function random(e,t){if(void 0===t)throw new Error("random end must be defined");var o=Math.floor(Math.random()*(t-e+1));return o+=e}function isFunction(e){var t={};return e&&"[object Function]"===t.toString.call(e)}function maybeFun(e){return isFunction(e)?e():void 0}function maybe(e){return function(t){return t?e(t):!1}}function dynamicInvoke(e){return function(t){return t[e](t)}}function randomFrom(e){var t=random(0,e.length-1);return e[t]}function chance(e,t){random(0,100)<e&&t()}function double(e){return 2*e}function randomDirection(){var e=1===random(0,2)?"+":"-";return e}function numberWithCommas(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function preload(){Assets.preload(game)}function create(){if(!G.created){setupStage(),setupTable(),G.init(game);var e=R.sortBy(R.prop("order")),t=R.compose(R.sum,R.filter(R.lte(1)),R.map(R.prop("order")))(assets);setupAssets(t?e(assets):assets),UI.listGroupsInMenu(),Controls.add(),UI.init(),setupHammer(),setupPlayers(),Cursor.set(),"play"===mode&&Video.init(),H.init()}}function setupHammer(){hammertime=new Hammer(document.getElementsByTagName("canvas")[0]);var e=hammertime.get("pan");e.set({direction:Hammer.DIRECTION_ALL,pointers:2});var t=hammertime.get("pinch");t.set({enable:!0,threshold:5}),t.recognizeWith(e),hammertime.on("panstart",function(){oldCameraX=game.camera.x,oldCameraY=game.camera.y}),hammertime.on("panmove",function(e){UI.hudMessage("pan",e.deltaX,e.deltaY,e.pointers.length),game.camera.x=oldCameraX-e.deltaX,game.camera.y=oldCameraY-e.deltaY}),hammertime.on("pinch",function(e){UI.hudMessage("pinch",e.deltaX,e.deltaY,e.pointers.length)}),hammertime.on("pinchin",function(){zoom(-.3)}),hammertime.on("pinchout",function(){zoom(.3)})}function zoom(e){game.camera.scale.set(game.camera.scale.x+e/100)}function setupStage(){game.stage.disableVisibilityChange=!0;var e=document.getElementById("please_wait");e&&e.remove(),game.scale.scaleMode=Phaser.ScaleManager.RESIZE,game.scale.fullScreenScaleMode=Phaser.ScaleManager.SHOW_ALL,game.scale.fullScreenTarget=document.body,game.scale.onResize=UI.update;var t=game.canvas;t.id="boardgame",game.canvas.oncontextmenu=function(e){e.preventDefault()},game.world.setBounds(0,0,World.width,World.height),game.scale.setScreenSize(!0),game.stage.disableVisibilityChange=!0}function gofull(){return game.scale.isFullScreen?void game.scale.stopFullScreen():void game.scale.startFullScreen()}function setupTable(){var e=game.add.image(0,0);e.opacity=0,e.width=World.width,e.height=World.height,e.inputEnabled=!0,e.interactive=!0,e.buttonMode=!0,e.events.onInputDown.add(Controls.onStartSelection),e.events.onInputUp.add(Controls.onStopSelection),table=game.add.tileSprite(0,0,World.width,World.height,"table")}function buildAssetArray(e,t){for(var o=[],n=0;t>n;n++)R.times(function(){o.push(n)})(e.counts[n]||1);return o}function setupAssets(e){var t,o,n=100,r=1;R.forEach(function(e){n+=150,n>=World.height-100&&(n=100);var i,a;i=e.args[0],a=t&&t===e.order?o:G.groups.add(i,e.order||0,e),"atlasJSONHash"===e.method&&(r=game.cache.getFrameCount(i),addCards(i,n,buildAssetArray(e,r),a)),"image"===e.method&&addTokens(R.repeatN(i,e.counts||r),a,100,n),"spritesheet"===e.method&&(r=e.args[4],e.isDice?R.times(function(){Dice.add(i,a,r,n)})(R.head(R.of(e.counts))||1):e.isStash?addStash(i,n,R.head(R.of(e.counts))||1,a):addCards(i,n,buildAssetArray(e,r),a)),t=e.order,o=a})(e)}function addStash(e,t,o,n){var r=0;R.times(function(o){var i=n.create(r,t,e,o);i.defaultFrame=1,i.isStash=!0,R.compose(T.setId,Cursor.reset,T.networkAble,T.draggable,T.centerAnchor)(i),T.hide(i)})(o)}function addCards(e,t,o,n){var r,i=0,a=0,s=0,l=0,d=0;return R.forEach(function(o){o===r?(a+=S.offsetY,i+=S.offsetX):(s++,i=0,a=0),d=100+120*s+i,d>=World.width-100&&(s=0,l+=100),l>=World.height-100&&(l=100);var c=n.create(d,t+a+l,e,o);c.defaultFrame=o,R.compose(T.setId,Cursor.reset,T.networkAble,T.lockable(n.lockable),T.stackable,T.flipable(n.flipable),T.rotateable(n.rotateBy),T.handable(n.handable),T.draggable,T.centerAnchor)(c),Controls.target=c,r=o})(o),Controls.target}function addTokens(e,t,o,n,r){o=o||100,n=n||300,r=r||1,R.forEach.idx(function(e,i){var a=t.create(o+S.offsetX*i,n+S.offsetY*i,e);T.setId(a),T.scale(r,a),R.compose(Cursor.reset,T.stackable,T.networkAble,T.rotateable(t.rotateBy),T.lockable(t.lockable),T.handable(t.handable),T.draggable,T.centerAnchor)(a)})(e)}function setupPlayers(){UI.updateNames(),players=game.add.group(),players.name="players",players.z=17,player={cursor:cursorId,name:playerName}}function update(){if(Network.ready!==!1){G.update(),Controls.update(),H.update();var e=Utils.getMousePosition();game.input.keyboard.isDown(Phaser.Keyboard.UP)||game.input.keyboard.isDown(Phaser.Keyboard.W)&&!UI.chatVisible()?game.camera.y-=50:game.input.keyboard.isDown(Phaser.Keyboard.DOWN)||game.input.keyboard.isDown(Phaser.Keyboard.S)&&!UI.chatVisible()?game.camera.y+=50:game.input.keyboard.isDown(Phaser.Keyboard.LEFT)||game.input.keyboard.isDown(Phaser.Keyboard.A)&&!UI.chatVisible()?game.camera.x-=50:game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)||game.input.keyboard.isDown(Phaser.Keyboard.D)&&!UI.chatVisible()?game.camera.x+=50:game.input.keyboard.isDown(Phaser.Keyboard.ENTER)?UI.enterPressed():game.input.keyboard.isDown(Phaser.Keyboard.I)&&!UI.chatVisible()?zoom(1):game.input.keyboard.isDown(Phaser.Keyboard.O)&&!UI.chatVisible()&&zoom(-1),game.input.mouse.event&&(game.input.mouse.event.wheelDeltaX&&(game.camera.x-=game.input.mouse.event.wheelDeltaX),game.input.mouse.event.wheelDeltaY&&(game.camera.y-=game.input.mouse.event.wheelDeltaY)),player.lastPosition&&player.lastPosition.x==e.x&&player.lastPosition.y==e.y||(Network.server.moveCursor(e),player.lastPosition=e)}}var Assets={};Assets.preload=function(e){var t=R.range(1,55);R.forEach(function(t){e.load.image("cursor"+t,"/img/cursors/"+t+".png")})(t),e.load.image("flip","/assets/flip.png"),e.load.image("stack","/assets/load.png"),e.load.image("shuffle","/assets/shuffle.png"),e.load.image("hand","/assets/hand.png"),e.load.image("user","/assets/user.png"),e.load.image("lock","/assets/lock.png"),e.load.image("table","/assets/table_low.jpg"),e.load.image("rotate","/assets/rotate.png"),e.load.spritesheet("button","/assets/button_sprite_sheet.png",193,71),e.load.audio("chatSound","/sounds/notify.wav"),e.load.audio("disconnectSound","/sounds/disconnect.wav"),e.load.audio("callSound","/sounds/call.wav"),R.forEach(function(t){t.args[0];return"spritesheet"===t.method?(e.load.onFileError.addOnce(function(){$("#load_error").text("Could not load asset. Too many frames specified, or frames not fitting inside texture")},e),void e.load[t.method].apply(e.load,t.args)):void e.load[t.method].apply(e.load,t.args)})(assets)};var Controls={},cursors;Controls.selected=[],Controls.getSelected=function(e){return Controls.selected.length?Controls.selected:[e]},Controls.add=function(){Controls.controls=game.add.group(),Controls.controls.position.set(-100),Controls.rotationControls=Controls.make(Controls.controls,"rotate",T.releaseRotate,T.startRotate),Controls.flipControls=Controls.make(Controls.controls,"flip",T.onFlip),Controls.stackControls=Controls.make(Controls.controls,"stack",S.onTidy),Controls.shuffleControls=Controls.make(Controls.controls,"shuffle",S.onShuffle),Controls.handControls=Controls.make(Controls.controls,"hand",T.onTake),Controls.lockControls=Controls.make(Controls.controls,"lock",T.onLock),Controls.userControls=Controls.make(Controls.controls,"user",T.onUserOwn),Controls.rotationControls.scale.set(.7),Controls.graphics=game.add.graphics(0,0),Controls.graphics.lineStyle(10,16777215,.8),Controls.graphics.beginFill(30719,.3),Controls.highlight=game.add.graphics(0,0),Controls.highlight.lineStyle(10,16777215,.8),Controls.highlight.beginFill(30719,.2)},Controls.make=function(e,t,o,n){var r=e.create(0,0,t);return T.centerAnchor(r),r.inputEnabled=!0,r.input.useHandCursor=!0,r.events.onInputUp.add(o),n&&r.events.onInputDown.add(n),Cursor.reset(r),r},Controls.setTarget=function(e){return Controls.target=e,Controls.hide(),Controls.assignRelativePositions(e),e},Controls.assignRelativePositions=function(e){R.forEach(S.assignRelativePosition(e))(Controls.selected)},Controls.at=function(e){Controls.show(e),Utils.toCorner(Controls.controls,e)},Controls.colorize=function(e){return e.isStash&&(Controls.userControls.tint=e.ownedBy?e.ownedBy===playerName?3407718:16724838:16777215),e},Controls.show=function(e){Controls.positionX=0,Controls.controls.visible=!0,Controls.position(Controls.flipControls,e.flipable),Controls.position(Controls.rotationControls,e.rotateable&&!Controls.selected.length),Controls.position(Controls.handControls,e.handable&&!Controls.selected.length),Controls.position(Controls.userControls,e.isStash&&!Controls.selected.length),Controls.position(Controls.lockControls,e.lockable&&!Controls.selected.length),Controls.colorize(e),Controls.position(Controls.stackControls,Controls.selected.length&&!e.isDice),Controls.position(Controls.shuffleControls,Controls.selected.length&&!e.isDice)},Controls.position=function(e,t){t?(e.visible=!0,e.x=Controls.positionX,Controls.positionX+=e.width):e.visible=!1},Controls.cloneTargetPos=function(){return Controls.target&&Controls.target.position.clone()},Controls.hide=function(e){return e?Controls.target===e&&(Controls.controls.visible=!1):Controls.controls.visible=!1,e},Controls.cursors=function(){game.input.keyboard.createCursorKeys()},Controls.onStartSelection=function(e,t){Controls.hide(),Controls.selecting=!0,Controls.rect={x:t.worldX/game.camera.scale.x,y:t.worldY/game.camera.scale.y}},Controls.sanitizeRect=function(e){var t={};return e.width<0?(t.x=e.x+e.width,t.width=-e.width):(t.x=e.x,t.width=e.width),e.height<0?(t.y=e.y+e.height,t.height=-e.height):(t.y=e.y,t.height=e.height),t},Controls.onStopSelection=function(){Controls.selecting=!1,Controls.graphics.clear(),Controls.selected.length&&Controls.at(Controls.setTarget(Controls.selected[0]))},Controls.findSelectedTiles=function(e){var t=[];return R.mapObj(function(o){R.forEach(function(o){var n=Utils.pointIntersection(o,e);n&&!o.locked&&o.stackable?(T.select(o),t.push(o)):T.deselect(o)})(o.children)})(G.groups.all()),t},Controls.dragAlong=function(e){T.dragging&&R.forEach(S.moveRelativeTo(Controls.target))(e)},Controls.update=function(){Controls.selecting?(game.input.mouse.event||game.input.pointer1.active)&&(Controls.rect.width=game.input.activePointer.worldX/game.camera.scale.x-Controls.rect.x,Controls.rect.height=game.input.activePointer.worldY/game.camera.scale.y-Controls.rect.y,Controls.graphics.clear(),Controls.selected=Controls.findSelectedTiles(Controls.sanitizeRect(Controls.rect)),Controls.graphics.drawRect(Controls.rect.x,Controls.rect.y,Controls.rect.width,Controls.rect.height)):Controls.selected.length&&(game.input.mouse.event||game.input.pointer1.active)&&Controls.dragAlong(Controls.selected)},Controls.verifySelection=function(e){R.contains(e)(Controls.selected)||Controls.deselectAll()},Controls.deselectAll=function(){R.forEach(T.deselect)(Controls.selected),Controls.selected=[]};var Cursor={};Cursor.new=function(e){var t=players.create(0,0,"cursor"+e.cursor);return t.name=e.name,t.addChild(game.add.text(40,0,e.name,{font:"26px Arial",fill:"#fff"})),Cursor.set(),t},Cursor.set=function(){game.canvas.setAttribute("style","cursor: url(/img/cursors/"+cursorId+".png), auto;")},Cursor.reset=function(e){return e.events.onInputOut.add(Cursor.set),e};var Dice={};Dice.add=function(e,t,o,n){var r=100+80*t.children.length,i=n;if(r>=2e3){var a=Math.floor(r/2e3);r-=2e3*a-100,i+=100*a}i>=World.height-100&&(i=100);var s=t.create(r,i,e);return t.numSides=o,s.animations.add("spin",R.range(0,o)),s.play("spin",30),s.animations.currentAnim.setFrame(0,!0),s.isDice=!0,T.draggable(s),T.stackable(s),Dice.spinnable(s),Cursor.reset(s),T.setId(s),T.networkAble(s),s},Dice.onSpinClicked=function(e){e.dragTimeout=setTimeout(function(){e.wasDragged=!0},300)},Dice.onSpinReleased=function(e){if(e.wasDragged)return void delete e.wasDragged;clearTimeout(e.dragTimeout);var t=R.compose(R.pluck("id"),R.filter(R.propEq("isDice",!0)))(Controls.getSelected(e));Network.server.spin(t,e.parent.numSides)},Dice.spin=function(e,t,o){R.forEach.idx(function(e,n){var r=G.findTile(e),i=t[n],a=o[n];r.play("spin",100,!0),setTimeout(function(){r.animations.stop(null,!1),r.frame=a},i-200),game.add.tween(r).to({rotation:i/20},i,Phaser.Easing.Cubic.Out,!0,0,!1)})(e)},Dice.spinnable=function(e){e.anchor.set(.4),e.events.onInputDown.add(Dice.onSpinClicked,this),e.events.onInputUp.add(Dice.onSpinReleased,this)};var G={};G._groups={},G._tiles={},G.init=function(e){G.created=!0,G._masterGroup=e.add.group()},G.addTile=function(e){G._tiles[e.id]=e},G.groups={add:function(e,t,o){t=t||0;var n=G._masterGroup.add(game.add.group());return n.z=t,n.name=e,n.rotateBy=Utils.deg2Rad(o.rotateBy)||0,n.flipable=o.flipable,n.handable=o.handable,n.lockable=o.lockable,n.icon=G.getIcon(o),G._groups[e]=n,n},get:function(e){return G._groups[e]},all:function(){return G._groups}},G.getIcon=function(e){return"spritesheet"===e.method?e.isDice?"fa-random":"fa-th":"atlasJSONHash"===e.method?"fa-th-list":"fa-photo"},G.addText=R.curryN(2,function(e,t,o,n){n=n||"#ccc";var r=game.add.text(20,20,e,{fontSize:"32px",fill:n});return o&&o(r,t),t.setText=r.setText.bind(r),t.addChild(r),t}),G.updatePositions=[],G.update=function(){R.forEach(function(e){if(e.follower&&e.follower.input.draggable){if(e.follower.relativePosition)return void Utils.alignRelativePosition(e.follower,e.target);Utils.alignPosition(e.follower,e.target)}if(e.startRotatePosition){var t=Utils.delta(e.startRotatePosition,Utils.getMousePosition()),o=Utils.rad2Deg(e.parent.rotateBy),n=Math.floor((2*-t.x+2*t.y)/o)*o,r=Utils.deg2Rad(n);e.rotation=e.startRotation+r}})(G.updatePositions)},G.addUpdatePosition=function(e){G.updatePositions.push(e)},G.removeUpdatePosition=function(e){G.updatePositions=R.reject(R.propEq("target",e))(G.updatePositions)},G.removeRotationPosition=function(e){G.updatePositions=R.reject(R.propEq("id",e))(G.updatePositions)},G.findTile=function(e){return G._tiles[e]||{}},G.findTiles=function(e){return R.map(function(e){return G.findTile(e)})(e)},G.saveSetup=function(){Network.server.saveSetup(),UI.chat("Saved setup",gameName)};var H={};H.offsetX=1.2,H.offsetY=-2,H.sizeX=100,H.sizeY=100,H.hand={},H.init=function(){H.graphics=game.add.graphics(0,0),H.graphics.lineStyle(2,6706500,.8),H.graphics.beginFill(0,.5),UI.fixedToCamera(!0,H.graphics),game.world.setChildIndex(H.graphics,2)},H.add=function(e){H.hand[e.id]=e,Controls.hide(),T.show(e)},H.update=function(){var e=50;R.mapObj(function(t){UI.fixedToCamera(!1,t),t.x=e,e+=t.width,t.y=game.camera.height-t.height/2,S.bringToTop(t),UI.fixedToCamera(!0,t)})(H.hand),H.sizeX=e,H.graphics.clear(),H.graphics.drawRoundedRect(-20,game.camera.height-H.sizeY,H.sizeX,game.camera.height,20,0)},H.release=function(e){UI.fixedToCamera(!1,e),H.hand[e.id]&&(T.hide(e),Network.server.fromHand(e.id),delete H.hand[e.id])};var Network={};Network.ready=!1,Network.isMine=function(e){return Network.myId===e},Network.setup=function(){Network.client=new Eureca.Client,Network.client.ready(function(e){Network.server=e}),Network.client.onConnectionLost(function(){UI.log("Connection to server lost!!!")}),Network.client.onDisconnect(function(){UI.log("Disconnected from server!!!")}),Network.client.onConnectionRetry(function(){UI.log("Retry connection to  server...")}),Network.client.exports.setId=function(e){Network.myId=e,Network.server.handshake(e,cursorId,playerName,roomName,mode),create(),UI.log(playerName+" connected to server"),Network.ready=!0},Network.client.exports.kill=function(e){playerList[e.id]&&(playerList[e.id].kill(),delete playerList[e.id],UI.chat(e.name,"left the table...",UI.disconnectSound),UI.updateNames()),Video.killClient(e.id,e.name)},Network.client.exports.spawnPlayer=function(e,t){if(!Network.isMine(e.id)){var o=Cursor.new(e);playerList[e.id]=o,UI.chat(e.name,"joined the table!"),UI.updateNames(),Video.newClient(e.id,e.name)}},Network.client.exports.updateCursor=function(e,t){Network.isMine(e.id)||playerList[e.id]&&(playerList[e.id].x=t.x,playerList[e.id].y=t.y)},Network.client.exports.dragTiles=function(e,t,o){if(!Network.isMine(e.id)&&t.length){var n=G.findTiles(t);return void R.forEach.idx(function(t,n){Controls.hide(t),t.relativePosition=o[n],G.addUpdatePosition({follower:t,target:playerList[e.id]})})(n)}},Network.client.exports.positionTile=function(e,t,o){if(Network.isMine(e.id)){var n=G.findTile(t);R.compose(T.enableInput,Controls.hide)(n),T.syncTile(n,o),o.lock&&T.lock(n),o.ownedBy?T.userOwns(n,o.ownedBy):T.nobodyOwns(n),o.hand&&(o.hand===playerName?H.add(n):n.visible=!1)}},Network.client.exports.dropTile=function(e,t,o){if(!Network.isMine(e.id)){var n=G.findTile(t);Controls.hide(n),n.visible=!0,G.removeUpdatePosition(playerList[e.id]),delete n.relativePosition,T.syncTile(n,o),UI.log(e.name,"moved a tile",n.id)}},Network.client.exports.flipTile=function(e,t,o){if(!Network.isMine(e.id)){var n=G.findTile(t);Controls.hide(n),n.frame=o,UI.log(e.name,"flipped tile",n.id)}},Network.client.exports.toHand=function(e,t){if(!Network.isMine(e.id)){var o=G.findTile(t);Controls.hide(o),o.visible=!1,UI.log(e.name,"took a tile to hand")}},Network.client.exports.fromHand=function(e,t){if(!Network.isMine(e.id)){var o=G.findTile(t);T.hide(o),o.visible=!0,UI.log(e.name,"plays tile from hand")}},Network.client.exports.lock=function(e,t){var o=G.findTile(t);T.lock(o),UI.log(e.name,"locks tile",o.id)},Network.client.exports.unlock=function(e,t){var o=G.findTile(t);T.unlock(o),UI.log(e.name,"unlocks tile",o.id)},Network.client.exports.ownedBy=function(e,t){var o=G.findTile(t);T.userOwns(o,e.name),UI.log(e.name,"owns tile",o.id)},Network.client.exports.releasedBy=function(e,t){var o=G.findTile(t);T.nobodyOwns(o),UI.log(e,"released tile",o.id)},Network.client.exports.updateStackCards=function(e,t,o,n){S[t](G.findTiles(o),n)},Network.client.exports.spin=function(e,t,o,n){Dice.spin(t,o,n),UI.log("Spinning",t.length,"dice")},Network.client.exports.receiveChat=function(e,t){UI.chat(e.name,t)},Network.client.exports.arrangeLayer=function(e,t){var o=G.groups.all()[t];G._masterGroup.moveUp(o),UI.listGroupsInMenu(),UI.log(e.name,"arranged layer "+t)}};var S={};S.offsetX=1.2,S.offsetY=-2,S.assignRelativePosition=function(e){return function(t){return t.relativePosition={x:t.x-e.x,y:t.y-e.y},t}},S.bringToTop=function(e){return e.bringToTop(),e},S.onShuffle=function(){Network.server.shuffleStack(T.getSelectedIds(),Controls.cloneTargetPos())},S.shuffle=function(e,t){var o=t||Controls.cloneTargetPos();R.forEach.idx(function(e,t){e.rotation=0,T.hide(e),S.bringToTop(e);var n=S.calculateCardPos(o,t,0);Utils.alignPosition(e,n)})(e)},S.onTidy=function(){Network.server.tidyStack(T.getSelectedIds(),Controls.cloneTargetPos())},S.tidy=function(e,t){var o={},n={},r=-e[0].width,i=t||Controls.cloneTargetPos();R.forEach.idx(function(e){if(o[e.key])R.contains(e.defaultFrame.toString())(R.keys(o[e.key]))?n[e.key][e.defaultFrame]+=1:(r+=e.width+20,o[e.key][e.defaultFrame]=r,n[e.key][e.defaultFrame]=1);else{var t={};r+=e.width+20,t[e.defaultFrame]=r,o[e.key]=t;var a={};a[e.defaultFrame]=1,n[e.key]=a}e.rotation=0,T.show(e);var s=S.calculateCardPos(i,n[e.key][e.defaultFrame],o[e.key][e.defaultFrame]);Utils.alignPosition(e,s),S.bringToTop(e)})(e)},S.calculateCardPos=function(e,t,o){return{x:e.x+S.offsetX*t+(o||0),y:e.y+S.offsetY*t}},S.moveRelativeTo=R.curry(function(e,t){return t.relativePosition&&t.input.draggable&&e!==t?(t.x=e.x+t.relativePosition.x,t.y=e.y+t.relativePosition.y,t):t});var T={};T.id=0,T.centerAnchor=function(e){return e.anchor.set(.5),e},T.draggable=function(e){return e.inputEnabled=!0,e.input.enableDrag(!1,!0),e.events.onInputOver.add(T.highlight),e.events.onInputOut.add(T.unlight),e.events.onInputDown.add(T.onDragControllable),e.events.onInputUp.add(T.onStopDragControllable),e},T.onUserOwn=function(e){var e=Controls.target;return Network.server.tileOwnedBy(e.id),e},T.userOwns=function(e,t){return e.isStash&&(e.ownedBy=t,Controls.colorize(e),e.ownedBy!==playerName&&(T.disableInput(e),T.hide(e))),e},T.nobodyOwns=function(e){return delete e.ownedBy,e.locked||T.enableInput(e),Controls.colorize(e),e},T.highlight=function(e){return Controls.highlight.clear(),!e.isStash||e.ownedBy&&e.ownedBy!==playerName?(Controls.highlight.drawRect(-e.width/2,-e.height/2,e.width,e.height),Controls.highlight.angle=e.angle,void Utils.alignPosition(Controls.highlight,e)):void T.show(e)},T.unlight=function(e){Controls.highlight.clear(),e.controls&&(e.controls.visible=!1),e.isStash&&T.hide(e)},T.syncTile=function(e,t){e&&t&&(e.x=t.x,e.y=t.y,e.rotation=t.rotation,e.frame=t.frame,e.isStash&&T.hide(e))},T.networkAble=function(e){return e.events.onInputDown.add(T.onStartDrag),e.events.onInputUp.add(T.onStopDrag),e},T.stackable=function(e){return e.stackable=!0,e},T.lockable=function(e){return function(t){return t.lockable=e,t.controls=Controls.make(t.parent,"lock",T.onUnLock.bind(t,t)),t.controls.tint=16724838,t.controls.alpha=0,t.controls.scale.set(.65),t.controls.events.onInputOver.add(T.overLock),t.controls.events.onInputOut.add(T.outLock),t.addChild(t.controls),t}},T.onLock=function(){var e=Controls.target;return Network.server.tileLock(e.id),e},T.onUnLock=function(e){return Network.server.tileLock(e.id),e},T.lock=function(e){return e.lockable&&(e.controls.visible=!0,e.controls.alpha=1,e.locked=!0,T.disableInput(e),Controls.hide(e),setTimeout(function(){game.add.tween(e.controls).to({alpha:0},1e3,Phaser.Easing.Linear.None,!0,0,!1)},1e3)),e},T.unlock=function(e){return e.controls.visible=!1,delete e.locked,T.enableInput(e),e},T.overLock=function(e){e.alpha=1},T.outLock=function(e){e.alpha=0},T.scale=R.curry(function(e,t){return t.scale.set(e),t}),T.setId=function(e){return e.id=T.id++,G.addTile(e),e},T.resetRotation=function(e){return e.rotation=0,e},T.rotateable=function(e){return function(t){return t.rotateable=e&&t.parent.rotateBy||!1,t}},T.startRotate=function(){var e=Controls.target;e.startRotatePosition=Utils.getMousePosition(),e.startRotation=e.rotation,G.addUpdatePosition(e)},T.releaseRotate=function(){var e=Controls.target,t=e.rotation-e.startRotation;Math.abs(t+.01)<e.parent.rotateBy&&(e.rotation+=e.parent.rotateBy),delete e.startRotatePosition,delete e.startRotation,G.removeRotationPosition(e.id),Network.server.tilesDragStop(T.getSelectedIds(e),T.getPositions(e))},T.flipable=function(e){return e?function(e){return e.flipable=!0,e}:R.I},T.handable=function(e){return e?function(e){return e.handable=!0,e}:R.I},T.onFlip=function(){var e=Controls.target;return e.flipable?(Network.server.flipTiles(T.getSelectedIds(e),T.nextFlipStates(e)),void R.forEach(T.flip)(Controls.getSelected(e))):R.I},T.nextFlipStates=function(e){return R.map(function(e){return e.frame===e.defaultFrame?0:e.defaultFrame})(Controls.getSelected(e))},T.onTake=function(){var e=Controls.target;H.add(e),Network.server.toHand(e.id)},T.getSelectedIds=function(e){return R.pluck("id")(Controls.getSelected(e))},T.getPositions=function(e){return R.map(function(e){return T.getPosition(e)})(Controls.getSelected(e))},T.getPosition=function(e){return{x:e.x,y:e.y,rotation:e.rotation,frame:e.frame}},T.onStartDrag=function(e){T.dragging=!0,H.release(e),Controls.highlight.clear(),Controls.verifySelection(e);var t=Controls.selected.length&&R.pluck("relativePosition")(Controls.selected)||[{x:0,y:0}];Network.server.tilesDragStart(T.getSelectedIds(e),t),Controls.setTarget(e)},T.onStopDrag=function(e){T.dragging=!1,T.checkBounds(e),Network.server.tilesDragStop(T.getSelectedIds(e),T.getPositions(e))},T.checkBounds=function(e){return(e.width<200||e.height<200)&&(e.x<0&&(e.x=0),e.x>World.width&&(e.x=World.width),e.y<0&&(e.y=0),e.y>World.height&&(e.y=World.height)),e},T.onDragControllable=function(e){T.dragging=!0,Controls.setTarget(e)},T.onStopDragControllable=function(e){T.dragging=!1,Controls.at(e)},T.disableInput=function(e){return e.inputEnabled=!1,e},T.enableInput=function(e){return e.inputEnabled=!0,e},T.flip=function(e){e.flipable&&(e.frame=e.frame===e.defaultFrame?0:e.defaultFrame)},T.show=function(e){return(e.flipable||e.isStash)&&e.defaultFrame&&(e.frame=e.defaultFrame),e},T.hide=function(e){return(e.flipable||e.isStash)&&e.defaultFrame&&(e.frame=0),e},T.select=function(e){return e.alpha=.5,e.selected=!0,e},T.deselect=function(e){return e.alpha=1,e.selected=!1,delete e.relativePosition,e};var UI={};UI.lines=[],UI.menuLines=[],UI.timeout=null,UI.init=function(){UI.group=game.add.group(),UI.graphics=game.add.graphics(0,0),UI.group.addChild(UI.graphics),UI.nameText=game.add.text(0,0,"----------------\nNAME:"+playerName,{font:"16px Helvetica",fill:"#ccc"},UI.group),UI.nameText.align="right",UI.nameText.alpha=.7,UI.nameText.setShadow(1,2,"#000000"),UI.messageText=game.add.text(0,0,"Messages:",{font:"18px monospace",fill:"#fff"},UI.group),UI.messageText.align="right",UI.messageText.alpha=1,UI.messageText.setShadow(3,3,"#000000",1),UI.chatInput=document.getElementById("chatInput"),UI.chatFrame=document.getElementById("chatFrame"),UI.textElements=[UI.nameText,UI.messageText,UI.graphics],UI.chatSound=game.add.audio("chatSound"),UI.disconnectSound=game.add.audio("disconnectSound"),UI.update()},UI.listGroupsInMenu=function(){var e=G._masterGroup.children,t=0;$("#layers").children().slice(1,99).remove(),R.forEach(function(e){$("#layers").append('<li><a href="#" onclick="UI.onArrangeLayer(\''+e.name+"')\">"+ ++t+'. <i class="fa fa-arrow-up fa-fw"></i>&nbsp;'+e.name+"</a></li>")})(R.reverse(e))},UI.onArrangeLayer=function(e){Network.server.arrangeLayer(e)},UI.enterPressed=function(){UI.enterDelay||(UI.chatVisible()?(UI.sendChat(),UI.hideChat()):UI.showChat(),UI.enterDelay=!0,setTimeout(function(){UI.enterDelay=!1},200))},UI.sendChat=function(){if(chatInput.value.length>0){var e=chatInput.value;chatInput.value="",Network.server.chat(e)}},UI.showChat=function(){chatFrame.style.setProperty("display",""),chatInput.focus()},UI.hideChat=function(){chatFrame.style.setProperty("display","none")},UI.chatVisible=function(){return"none"!==chatFrame.style.getPropertyValue("display")},UI.update=function(){R.forEach(UI.fixedToCamera(!1))(UI.textElements),UI.messageText.x=game.camera.width-280,UI.nameText.x=16,UI.nameText.y=16,UI.messageText.y=280,Utils.alignPosition(UI.graphics,UI.messageText),R.forEach(UI.fixedToCamera(!0))(UI.textElements)},UI.fixedToCamera=R.curry(function(e,t){return t.fixedToCamera=e,t}),UI.handCursor=function(e){return e.input.useHandCursor=!0,e},UI.hudMessage=function(){UI.messageText.alpha=1,UI.graphics.alpha=1;var e=R.join(" ",slice(arguments)),t=e.match(/.{1,25}/g);UI.lines=R.concat(t,UI.lines),UI.lines.length>10&&UI.lines.pop(),UI.messageText.setText(R.join("\n")(UI.lines)+"\n..."),UI.log(e),UI.graphics.clear(),UI.graphics.lineStyle(1,8947848,1),UI.graphics.beginFill(13742776593,.5),UI.graphics.drawRect(-10,-10,UI.messageText.width+20,UI.messageText.height+20),clearTimeout(UI.timeout),UI.messageTween&&UI.messageTween.stop(),UI.graphicsTween&&UI.graphicsTween.stop(),UI.timeout=setTimeout(function(){UI.messageTween=game.add.tween(UI.messageText).to({alpha:0},2e3,Phaser.Easing.Linear.None,!0),UI.graphicsTween=game.add.tween(UI.graphics).to({alpha:0},2e3,Phaser.Easing.Linear.None,!0)},1e4)},UI.log=function(){var e=R.join(" ",slice(arguments));UI.menuLines=R.concat([e],UI.menuLines),UI.menuLines.length>30&&UI.menuLines.pop(),$("#menu-chat-text").html(R.join("<br><br>")(UI.menuLines))},UI.chat=function(e,t,o){return UI.messageText.clearColors(),UI.hudMessage(e+": "+t),UI.messageText.addColor("#5cb85c",0),UI.messageText.addColor("#cccccc",e.length+1),o?void o.play():void(playerName.toLowerCase()!==e.toLowerCase()&&UI.chatSound.play())},UI.setNames=function(e){UI.nameText.setText(R.join("\n")(e)),UI.nameText.addColor("#5cb85c",0),UI.nameText.addColor("#cccccc",playerName.length)},UI.updateNames=function(){UI.setNames(R.concat([playerName],R.pluck("name",R.values(playerList))))};var Utils={humanize:function(e,t,o){return R.align(ifLte,R.interpolate(e,t,o.length),o)},alignPosition:function(e,t){e&&t&&(e.x=t.x,e.y=t.y)},alignRelativePosition:function(e,t){e&&t&&e.relativePosition&&(e.x=t.x+e.relativePosition.x,e.y=t.y+e.relativePosition.y)},alignRelativePosRot:function(e,t){e&&t&&e.relativePosition&&(e.x=t.x+e.relativePosition.x,e.y=t.y+e.relativePosition.y,e.rotation=t.rotation)},getMousePosition:function(){return{x:Math.floor(game.input.activePointer.worldX),y:Math.floor(game.input.activePointer.worldY)}},toCorner:function(e,t){e&&t&&(e.x=t.x-t.width/2,e.y=t.y-t.height/2)},childTo:function(e,t){return function(o,n){o&&n&&(o.x=n.width*e,o.y=n.height*t)}},aboveCorner:R.curry(function(e,t){return t&&e&&(t.x=e.x-e.width/2,t.y=e.y-e.height/2-t.height),t}),delta:function(e,t){return{x:e.x-t.x,y:e.y-t.y}},shuffle:function(e){for(var t=e.length-1;t>0;t--){var o=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[o],e[o]=n}return e},printargs:function(){return arguments[0]},buttonize:function(e,t){return e.interactive=!0,e.buttonMode=!0,e.defaultCursor="pointer",e.click=e.tap=t,e},angle:function(e){return Math.atan2(e.y,e.x)},angle2points:function(e,t){return R.compose(Utils.angle,Utils.delta)(e,t)},rad2Deg:function(e){var t=180*e/Math.PI;return 0>t&&(t+=360),t},deg2Rad:function(e){0>e&&(e+=360);var t=e/180*Math.PI;return t},addProperties:function(e,t){return R.forEach(function(o){e[o]=t[o]})(R.keys(t)),e},rotate90:function(e){return e+Math.PI/2},removeFromArray:R.curry(function(e,t){return t&&t.length>0&&t.splice(t.indexOf(e),1),e}),removeChildren:function(e){R.times(function(){e.children.length&&e.getChildAt(0)&&e.removeChild(e.getChildAt(0))},e.children.length)},move:function(e){var t,o,n=e.rotation,r=e.speed;return t=Math.cos(n)*r,o=Math.sin(n)*r,e.position.set(e.x+t,e.y+o),e},center:function(e,t){e.x=t.x+(t.width-e.width)/2,e.y=t.y+(t.height-e.height)/2},testHitArray:function(e,t){return function(o){for(var n=t.length-1;n>=0;n-=1)Utils.testHit(o,t[n],e);return o}},testHit:function(e,t,o){Utils.collidesRectCircle(e,t)&&o(e,t)},testNearMissArray:function(e,t){return function(o){for(var n=t.length-1;n>=0;n-=1)Utils.testNearMiss(o,t[n],e);return o}},testNearMiss:function(e,t,o){Utils.collidesRectCircle(e,t,t.nearMissRadius)&&o(t)},pointIntersection:function(e,t){return e.x>t.x&&e.x<t.x+t.width&&e.y>t.y&&e.y<t.y+t.height},simpleIntersection:function(e,t){return!(t.x>e.x+e.width||t.x+t.width<e.x||t.y>e.y+e.height||t.y+t.height<e.y)},getPowDistance:function(e,t,o,n){var r=Math.abs(e-o),i=Math.abs(t-n);return r*r+i*i},collidesRectCircle:function(e,t,o){var n=o||.5*t.width,r=.75*Math.max(e.width,e.height);if(Math.abs(t.x-e.x)<n+r&&Math.abs(t.y-e.y)<n+r){var i,a,s=e.rotation>0?-1*e.rotation:-1*e.rotation+Math.PI,l=Math.cos(s)*(t.x-e.x)-Math.sin(s)*(t.y-e.y)+e.x,d=Math.sin(s)*(t.x-e.x)+Math.cos(s)*(t.y-e.y)+e.y,c=e.x-.5*e.width,u=e.y-.5*e.height;i=c>l?c:l>c+e.width?c+e.width:l,a=u>d?u:d>u+e.height?u+e.height:d;var g=this.getPowDistance(l,d,i,a);if(n*n>g)return!0}return!1},doPolygonsIntersect:function(e,t){var o,n,r,i,a,s,l,d,c=[e,t];for(i=0;i<c.length;i++){var u=c[i];for(a=0;a<u.length;a++){var g=(a+1)%u.length,h=u[a],f=u[g],p={x:f.y-h.y,y:h.x-f.x};for(o=n=void 0,s=0;s<e.length;s++)r=p.x*e[s].x+p.y*e[s].y,(isUndefined(o)||o>r)&&(o=r),(isUndefined(n)||r>n)&&(n=r);for(l=d=void 0,s=0;s<t.length;s++)r=p.x*t[s].x+p.y*t[s].y,(isUndefined(l)||l>r)&&(l=r),(isUndefined(d)||r>d)&&(d=r);if(l>n||o>d)return CONSOLE("polygons don't intersect!"),!1}}return!0}},Video={};Video.existingCalls=[],Video.clients={},navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,Video.getClientName=function(e){return Video.clients[e]||"unknown"
},Video.init=function(){$.get("http://0.peerjs.com:9000",function(){}),$("#video-container").show(),$("#video-container").draggable(),$("#get-media").hide(),Video.peer=Video.newPeerServerConnection(),Video.setupCallbacks(Video.peer),Video.callSound=game.add.audio("callSound")},Video.setupCallbacks=function(e){e.on("open",function(e){Video.id=e}),e.on("call",function(e){Video.callSound.play(),$("#callee-name").text(Video.getClientName(e.peer)),$("#accept-call-button").off(),$("#accept-call-button").on("click",function(){$("#accept-call-modal").modal("hide"),Video.askGetMedia(function(){e.answer(window.localStream),Video.step3(e)})}),$("#accept-call-modal").modal({keyboard:!0,show:!0})}),e.on("error",function(e){if(/Could not connect to peer (\w+)/.exec(e.message)){var t=/Could not connect to peer (\w+)/.exec(e.message)[1];Video.showCallButton(t)}else Video.peer.reconnect()})},Video.newPeerServerConnection=function(){var e=new Peer(Network.myId,{key:"8z62zmz8keasjor",debug:1,iceServers:[{url:"stun:stun.l.google.com:19302"}]});return e},Video.askGetMedia=function(e){return Video.askedAlready?void(e&&e()):(Video.askedAlready=!0,$("#get-media").show(),void $(function(){$("#get-media-retry").click(function(){$("#get-media-error").hide(),Video.getMedia(e)}),Video.getMedia(e)}))},Video.getMedia=function(e){$("#get-media-error").hide(),navigator.getUserMedia({audio:!0,video:!0},function(t){$("#my-video").prop("src",URL.createObjectURL(t)),$("#my-video").show(),window.localStream=t,$("#get-media").hide(),e&&e()},function(){$("#get-media-error").show(),$("#my-video").hide()})},Video.newClient=function(e,t){e&&(Video.clients[e]=t,Video.addVideoClient(e),$("#"+e).find(".step3").hide(),$("#"+e).find(".call-text").text(" "+t),$(function(){$("#"+e).find(".make-call").click(function(){var e=$(this).parents("div.video-group").attr("id");Video.askGetMedia(function(){var t=Video.peer.call(e,window.localStream);Video.step3(t)})}),$("#"+e).find(".end-call").click(function(){$(this).parents("div.video-group").attr("id");Video.existingCalls[e].close(),Video.showCallButton(e)})}),Video.showCallButton(e))},Video.killClient=function(e){Video.removeVideoClient(e)},Video.addVideoClient=function(e){$("#their-videos").append('<div class="video-group no-select" id="'+e+'"><div class="step3"><a href="#" class="btn btn-xs btn-danger end-call">x</a></div><video class="video" style="display: none;" autoplay></video><div class="step step2"><a href="#" class="btn btn-success make-call"><b class="fa fa-video-camera call-text"></b></a></div></div>')},Video.removeVideoClient=function(e){$("#"+e).remove()},Video.showCallButton=function(e){$("#get-media").hide(),$("#"+e).find(".step3").hide(),$("#"+e).find(".step2").show()},Video.step3=function(e){Video.existingCalls[e.peer]&&Video.existingCalls[e.peer].close(),e&&(e.on("stream",function(t){$("#"+e.peer).find("video").show(),$("#"+e.peer).find("video").prop("src",URL.createObjectURL(t))}),e.on("close",function(){$("#"+e.peer).find("video").hide(),Video.showCallButton(e.peer)}),e.on("error",function(){$("#"+e.peer).find("video").hide()}),Video.existingCalls[e.peer]=e,$("#get-media").hide(),$("#"+e.peer).find(".step2").hide(),$("#"+e.peer).find(".step3").show())};var Screen={},World={width:5e3,height:4e3};Screen.x=window.innerWidth,Screen.y=window.innerHeight;var game=new Phaser.Game(Screen.x,Screen.y,Phaser.CANVAS,"boardgame",{preload:preload,create:Network.setup,update:update}),players,table,playerList={},player={},hammertime,oldCameraX,oldCameraY,currFFZoom=1,currIEZoom=100,screenShot=function(){window.open(game.canvas.toDataURL())};