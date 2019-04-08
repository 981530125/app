var flag, btnEle, cur, nx, ny, dx, dy, x, y; 
flag = false;
btnEle = document.getElementById("btnFS"); 
cur = {x: 0,y: 0 };
function down() {
    var touch = event.touches[0];
    flag = true;
    cur.x = touch.clientX;
    cur.y = touch.clientY;
    dx = btnEle.offsetLeft;
    dy = btnEle.offsetTop;
}
function move(){
    if(flag){
        var touch = event.touches[0];
        nx = touch.clientX - cur.x;
        ny = touch.clientY - cur.y;
        x = dx + nx;
        y = dy + ny;
        if(Math.abs(nx)) {
             event.preventDefault();
        }
        if (x<=0) {
            x = 0;
        } else if(x>=btnEle.parentNode.offsetWidth - btnEle.offsetWidth) {
            x = btnEle.parentNode.offsetWidth - btnEle.offsetWidth;
        } else {
            x = x;
        }

        if (y<=0) {
            y = 0;
        } else if(y>=btnEle.parentNode.offsetHeight - btnEle.offsetHeight) {
            y = btnEle.parentNode.offsetHeight - btnEle.offsetHeight;
        } else {
            y = y;
        }
        btnEle.style.left = x +"px";
        btnEle.style.top = y +"px";
    }
}
function end(){
    flag = false; 
}
btnEle.addEventListener("touchstart",function(){
    down();
},false);
btnEle.addEventListener("touchmove",function(){
    move();
},false);
btnEle.addEventListener("touchend",function(){
    end();
},false);
btnEle.addEventListener("click", function(event) {
    if (!$scope.isFull) {
        document.querySelector('.col-md-3').style.display = 'none';
        document.querySelector('.invite').style.display = 'none';
        document.querySelector('#matters').classList = 'hidden';
        this.innerText = "退出体验";
        $scope.isFull = true;
    } else {
        document.querySelector('.col-md-3').style.display = 'block';
        document.querySelector('.invite').style.display = 'block';
        document.querySelector('#matters').classList = 'visible-xs visibile-sm';
        this.innerText = "开始体验";
        $scope.isFull = false;
    }
});