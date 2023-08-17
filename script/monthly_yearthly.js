var houseData;
var nowPage;
var code
var month
var endPage;
    // api 호출 코드
    function callApi(code,month){
    $('#loading').show();
    $('#content').empty();
    $.ajax({
        method : "GET",
        url :"URL",
        dataType: "xml",
        data:{
            ServiceKey :"ClientID",
            LAWD_CD : code,
            DEAL_YMD : month
        }
    }).done((res)=>{
        houseData = res;
        datas = $(res).find('item');
        AddList(datas,1);
        console.log(res);
        endPage = Math.ceil(datas.length / 10);
        paging(1,endPage);
        $('#loading').hide();
        $('#sort').show();
    });
}

// 쿼리 매개변수 받는 함수
$(document).ready(function(){
    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return decodeURIComponent(results[1]) || 0;
        }
    };
    code = $.urlParam('code');
    month = $.urlParam('month');
    callApi(code,month);
})

// 거래 목록들
function AddList(res,page){
    //1일때 0 2일때 10 3일때 20
    var j = (page-1) * 10;
    for(var i=0; i<10;i++){
        data = res[j+i];
        if($(data).find('월세금액').text() == 0){
            $('#content').append(
                '<div class = "info-div" id ="info-div-'+(j+i)+'">'+
                    '<p class="info-p name">'+$(data).find('아파트').text()+'</p>'+
                    '<p class="info-p month">'+$(data).find('월').text()+'월</p>'+
                    '<p class="info-p day">'+$(data).find('일').text()+'일</p>'+
                    '<p class="info-p money">전세: '+$(data).find('보증금액').text()+'만원</p>'+
                    '<p class="info-p address">'+$(data).find('도로명').text()+'</p>'+
                '</div>'
            )
        }
        else{
            $('#content').append(
                '<div class = "info-div" id ="info-div-'+(j+i)+'">'+
                    '<p class="info-p name">'+$(data).find('아파트').text()+'</p>'+
                    '<p class="info-p month">'+$(data).find('월').text()+'월</p>'+
                    '<p class="info-p day">'+$(data).find('일').text()+'일</p>'+
                    '<p class="info-p money">월세: '+$(data).find('월세금액').text()+'만원</p>'+
                    '<p class="info-p money">보증금: '+$(data).find('보증금액').text()+'만원</p>'+
                    '<p class="info-p address">'+$(data).find('도로명').text()+'</p>'+
                '</div>'
            )                
        }
    }
}

// 상세페이지 이동
$(document).on('click','.info-div',function(){
    // 모달 열기 버튼 클릭 시 모달 열기
    document.getElementById("myModal").style.display = "block";

    var idValue = $(this).attr('id');
    var iValue = parseInt(idValue.split('-')[2]);
    data = $(houseData).find('item')[iValue];
    $('.modal-main-content').empty();
    $('.modal-main-content').append(
    '<h2>'+$(data).find('아파트').text()+'</h2>'+
    '<div id="rvWrapper">'+
        '<div id="roadview" style="width:500px;height:400px;"></div>'+
    '</div>'+
    '<div class = "detail-div" style = "padding-right:10px;">'+
        '<div>'+
            '<p class="info-p month">거래날짜: '+$(data).find('년').text()+"년"+$(data).find('월').text()+"월"+$(data).find('일').text()+'일</p>'+
            '<p class="info-p money">보증금액: '+$(data).find('보증금액').text()+'만원</p>'+
            '<p class="info-p money">월세금액: '+$(data).find('월세금액').text()+'만원</p>'+
            '<p class="info-p address">주소: '+ $(data).find('법정동').text() + $(data).find('지번').text()+'</p>'+
            '<p class="info-p makeYears">건축년도: '+$(data).find('건축년도').text()+'년</p>'+
            '<p class="info-p area">전용면적: '+$(data).find('전용면적').text()+'m2</p>'+
            '<p class="info-p floor">해당층: '+$(data).find('층').text()+'층</p>'+
        '</div>'+
       '<div id="mapWrapper">'+
         '<div id="map"  style="width:300px;height:200px; margin-top: 16px;"></div>'+
       '</div>'+
    '</div>'
    );
    openMap($(data).find('법정동').text() + $(data).find('지번').text());
})

// page 만들기
function paging(page,endPage){
    $('#page').empty();
    console.log(page);
    console.log(endPage);
    $('#page').append('<p class="page" id = "ltButton"> < </p>');
    if(page==1){
        var j = 5;
    }
    else if(page==2){
        var j = 4;
    }
    else{
        var j = 3;
    }
    for(var i = page -2; i<page+j;i++){
        if((i > 0) && (i <= endPage) ){
            $('#page').append('<p class="page" id = "page-'+ i +'">' + i +'</p>');
        }
    }
    $('#page').append('<p class="page" id = "rtButton"> > </p>');
    $('#page-'+page).css('color','red');
    console.log('#page-'+page);
}
// page 이동
$(document).on('click','.page',function(){
    var idValue = $(this).attr('id');
    var iValue = parseInt(idValue.split('-')[1]);
    paging(iValue,endPage);
    $('#content').empty();
    AddList($(houseData).find('item'),iValue);        
})

$(document).on('click','#ltButton',function(){
    paging(1,endPage);
    $('#content').empty();
    AddList($(houseData).find('item'),1);        
})

$(document).on('click','#rtButton',function(){
    paging(endPage,endPage);
    $('#content').empty();
    AddList($(houseData).find('item'),endPage);        
})

// 모달 닫기 버튼 클릭 시 모달 닫기
$(document).on('click','.close',function() {
    document.getElementById("myModal").style.display = "none";
    });

// 모달 바깥 클릭 시 모달 닫기
window.addEventListener("click", function(event) {
var modal = document.getElementById("myModal");
if (event.target === modal) {
    modal.style.display = "none";
}
});

//지도위에 현재 로드뷰의 위치와, 각도를 표시하기 위한 map walker 아이콘 생성 클래스
function MapWalker(position){

//커스텀 오버레이에 사용할 map walker 엘리먼트
var content = document.createElement('div');
var figure = document.createElement('div');
var angleBack = document.createElement('div');

//map walker를 구성하는 각 노드들의 class명을 지정 - style셋팅을 위해 필요
content.className = 'MapWalker';
figure.className = 'figure';
angleBack.className = 'angleBack';

content.appendChild(angleBack);
content.appendChild(figure);

//커스텀 오버레이 객체를 사용하여, map walker 아이콘을 생성
var walker = new kakao.maps.CustomOverlay({
position: position,
content: content,
yAnchor: 1
});

this.walker = walker;
this.content = content;
}

//로드뷰의 pan(좌우 각도)값에 따라 map walker의 백그라운드 이미지를 변경 시키는 함수
//background로 사용할 sprite 이미지에 따라 계산 식은 달라 질 수 있음
MapWalker.prototype.setAngle = function(angle){

var threshold = 22.5; //이미지가 변화되어야 되는(각도가 변해야되는) 임계 값
for(var i=0; i<16; i++){ //각도에 따라 변화되는 앵글 이미지의 수가 16개
if(angle > (threshold * i) && angle < (threshold * (i + 1))){
    //각도(pan)에 따라 아이콘의 class명을 변경
    var className = 'm' + i;
    this.content.className = this.content.className.split(' ')[0];
    this.content.className += (' ' + className);
    break;
}
}
};

//map walker의 위치를 변경시키는 함수
MapWalker.prototype.setPosition = function(position){
this.walker.setPosition(position);
};

//map walker를 지도위에 올리는 함수
MapWalker.prototype.setMap = function(map){
this.walker.setMap(map);
};

// 장소 검색 객체 생성
var ps = new kakao.maps.services.Places();

function openMap(address){
// 키워드로 장소를 검색합니다
ps.keywordSearch(address, function(result, status) {
// keywordSearch
// 정상적으로 검색이 완료됐으면 
if (status === kakao.maps.services.Status.OK) {

coords = new kakao.maps.LatLng(result[0].y, result[0].x);
/*
* 아래부터 실제 지도와 로드뷰 map walker를 생성 및 제어하는 로직
*/
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    // mapCenter = new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 가운데 좌표
    mapCenter = coords, // 지도의 가운데 좌표

    mapOption = {
        center: mapCenter, // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 로드뷰 도로를 지도위에 올린다.
map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);

var roadviewContainer = document.getElementById('roadview'); // 로드뷰를 표시할 div
var roadview = new kakao.maps.Roadview(roadviewContainer); // 로드뷰 객체
var roadviewClient = new kakao.maps.RoadviewClient(); // 좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

// 지도의 중심좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
roadviewClient.getNearestPanoId(mapCenter, 100, function(panoId) {
    roadview.setPanoId(panoId, mapCenter); // panoId와 중심좌표를 통해 로드뷰 실행
});

var mapWalker = null;
// 로드뷰의 초기화 되었을때 map walker를 생성한다.
kakao.maps.event.addListener(roadview, 'init', function() {
    // map walker를 생성한다. 생성시 지도의 중심좌표를 넘긴다.
    mapWalker = new MapWalker(mapCenter);
    mapWalker.setMap(map); // map walker를 지도에 설정한다.

    // 로드뷰가 초기화 된 후, 추가 이벤트를 등록한다.
    // 로드뷰를 상,하,좌,우,줌인,줌아웃을 할 경우 발생한다.
    // 로드뷰를 조작할때 발생하는 값을 받아 map walker의 상태를 변경해 준다.
    kakao.maps.event.addListener(roadview, 'viewpoint_changed', function(){

        // 이벤트가 발생할 때마다 로드뷰의 viewpoint값을 읽어, map walker에 반영
        var viewpoint = roadview.getViewpoint();
        mapWalker.setAngle(viewpoint.pan);

    });

    // 로드뷰내의 화살표나 점프를 하였을 경우 발생한다.
    // position값이 바뀔 때마다 map walker의 상태를 변경해 준다.
    kakao.maps.event.addListener(roadview, 'position_changed', function(){

        // 이벤트가 발생할 때마다 로드뷰의 position값을 읽어, map walker에 반영 
        var position = roadview.getPosition();
        mapWalker.setPosition(position);
        map.setCenter(position);

    });
});
}
});
}