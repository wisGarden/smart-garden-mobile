import {Component, ElementRef, ViewChild} from '@angular/core';
import {App, IonicPage, Keyboard, NavParams} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {GlobalProvider} from "../../providers/global/global";
import {SceneryDetailPage} from "../scenery-detail/scenery-detail";
import {SceneryListPage} from "../scenery-list/scenery-list";

/**
 * Generated class for the SceneryMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var AMap;
declare var AMapUI;

@IonicPage()
@Component({
    selector: 'page-scenery-main',
    templateUrl: 'scenery-main.html',
})
export class SceneryMainPage {
    @ViewChild('map_container') map_container: ElementRef;
    map: any = null;
    latitude = null;
    longitude = null;
    blueMarker = null;
    searchMarkers = [];
    province: string = "北京";
    currentProvince: string = "北京";
    sceneryList: any = [];
    keyword: string = "";

    constructor(public app: App, public navParams: NavParams,
                public geolocation: Geolocation, public network: GlobalProvider,
                public keyboard: Keyboard) {
        this.getCurrentPosition(() => {
            this.initMap();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SceneryMainPage');
        // 获取经纬度失败，显示默认蓝点
        setTimeout(() => {
            if (this.latitude == null && this.longitude == null) {
                this.initMap();
            }
        }, 2000);
    }

    ionViewDidEnter() {
    }

    // 将gps经纬度转化为高德经纬度
    convert(latitude, longitude, callback) {
        AMap.convertFrom([longitude, latitude], "gps", callback);
    }

    getCurrentPosition(callback) {
        this.geolocation.getCurrentPosition().then((resp) => {
            console.log("latitude: " + resp.coords.latitude + " longitude: " + resp.coords.longitude);
            this.convert(resp.coords.latitude, resp.coords.longitude, (status, result) => {
                if (status === 'complete' && result.info === 'ok') {
                    // result为对应的地理位置详细信息
                    this.latitude = result.locations[0].P;
                    this.longitude = result.locations[0].O;
                    this.getProvince();
                    callback();
                }
            });
        }).catch((error) => {
            console.log("Error getting location", error);
        });
    }

    initMap() {
        this.map = new AMap.Map(this.map_container.nativeElement, {
            view: new AMap.View2D({
                center: (this.longitude == null ? null : [this.longitude, this.latitude]),
                rotateEnable: true,
                showBuildingBlock: true
            })
        });
        if (this.latitude == null && this.longitude == null) {
            this.changeMapProvince(null);
        } else {
            this.buildBlueMarker(this.latitude, this.longitude);
        }
    }

    buildBlueMarker(latitude, longitude) {
        if (this.blueMarker != null && this.map != null) {
            this.map.remove(this.blueMarker);
        }
        // 构造蓝点标记
        this.blueMarker = new AMap.Marker({
            icon: new AMap.Icon({
                image: "assets/imgs/current-position.png",
                size: new AMap.Size(54, 66),  //图标大小
                imageSize: new AMap.Size(27, 33)
            }),
            position: (longitude == null ? null : [longitude, latitude])
        });
        this.map.add(this.blueMarker);
        this.resetToPosition();
    }

    resetToPosition() {
        if (this.map != null) {
            this.map.setFitView();
        }
    }

    changeMapProvince(callback ?: () => void) {
        if (this.province == this.currentProvince) {
            if (this.latitude != null && this.longitude != null) {
                this.buildBlueMarker(this.latitude, this.longitude);
                return;
            }
        }
        AMap.plugin('AMap.Autocomplete', () => {
            // 实例化Autocomplete
            let autoOptions = {
                //city 限定城市，默认全国
                city: this.province
            };
            let autoComplete = new AMap.Autocomplete(autoOptions);
            autoComplete.search(this.province, (status, result) => {
                if (status === 'complete' && result.info === 'OK') {
                    // alert(JSON.stringify(result));
                    // 搜索成功时，result即是对应的匹配数据
                    for (let item of result.tips) {
                        // 确保拥有位置信息
                        if (item.location.hasOwnProperty("P")) {
                            // 确保地址在对应省份
                            if (item.district.match(this.province)) {
                                this.buildBlueMarker(item.location.P, item.location.O);
                                callback && callback();
                                break;
                            }
                        }
                    }
                }
            })
        });
    }

    getProvince() {
        if (this.latitude != null && this.longitude != null) {
            //实例化Geocoder
            AMap.plugin('AMap.Geocoder', () => {
                let geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    city: '全国'
                });

                // 使用geocoder做地理/逆地理编码
                geocoder.getAddress([this.longitude, this.latitude], (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        // result为对应的地理位置详细信息
                        for (let i = 0; i < this.network.getProvince().length; i++) {
                            if (result.regeocode.addressComponent.province.match(this.network.getProvince()[i].name)) {
                                this.province = this.network.getProvince()[i].name;
                                this.currentProvince = this.network.getProvince()[i].name;
                                break;
                            }
                        }
                    }
                });
            });

        }
    }

    addSimpleMarker(latitude, longitude, i) {
        AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
            //创建SimpleMarker实例
            let marker = new SimpleMarker({
                //前景文字
                iconLabel: {
                    innerHTML: '<div>' + (i + 1) + '</div>',
                    style: {
                        color: 'white'//设置文字颜色
                    }
                },
                //图标主题
                iconTheme: 'fresh',
                //背景图标样式
                iconStyle: 'orange',
                //...其他Marker选项...，不包括content
                position: [longitude, latitude]
            });
            if (this.map != null) {
                this.map.add(marker);
                marker.on('click', (e) => {
                    this.jumpToDetail(this.sceneryList[i]);
                });
            }
            this.resetToPosition();
            this.searchMarkers.push(marker);
        });
    }

    removeMarkers() {
        if (this.map != null) {
            for (let i = 0; i < this.searchMarkers.length; i++) {
                this.map.remove(this.searchMarkers[i]);
            }
            this.searchMarkers = [];
        }
    }

    onSearchKeyUp(event) {
        if (event.key == "Enter") {
            if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
                this.keyboard.close();
            }
            this.getItems(event);
        }
    }

    getItems(event) {
        this.keyword = event.target.value;
        this.removeMarkers();
        if (this.keyword == null || this.keyword.toString().trim() == "") {
            this.resetToPosition();
            return;
        }
        this.getSceneryData();
    }

    getSceneryData() {
        let id = '3'; //默认北京
        for (let i = 0; i < this.network.getProvince().length; i++) {
            if (this.province.match(this.network.getProvince()[i].name)) {
                id = this.network.getProvince()[i].id;
            }
        }
        this.network.getScenery(this.keyword, 1, id, (data, error) => {
            if (data) {
                if (data.data != null) {
                    this.sceneryList = data.data;
                    let list = [];
                    for (let i = 0; i < this.sceneryList.length; i++) {
                        if (this.sceneryList[i].latitude != null && this.sceneryList[i].longitude != null &&
                            parseFloat(this.sceneryList[i].latitude) <= 90) {
                            list.push(this.sceneryList[i]);
                        }
                    }
                    this.sceneryList = list;
                    for (let i = 0; i < this.sceneryList.length; i++) {
                        // alert(this.sceneryList[i].latitude+" "+this.sceneryList[i].longitude);
                        this.convert(this.sceneryList[i].latitude, this.sceneryList[i].longitude, (status, result) => {
                            this.addSimpleMarker(result.locations[0].P, result.locations[0].O, i);
                        });
                    }
                }
            }
        });
    }

    jumpToDetail(data) {
        this.app.getRootNavs()[0].push(SceneryDetailPage, {
            data: data
        });
    }

    jumpToList() {
        this.app.getRootNavs()[0].push(SceneryListPage, {
            keyword: this.keyword,
            province: this.province,
            callback: this.callback
        });
    }

    // 绑定select改变事件
    change(event) {
        // alert(this.province);
        this.removeMarkers();
        this.keyword = "";
        this.changeMapProvince(null);
    }

    selectClicked() {
        setTimeout(() => {
            document.getElementsByClassName("alert-head")[0].innerHTML = "<h2 class='alert-title'>选择城市</h2>";
        }, 100);

    }

    // 页面pop回调方法
    callback = (data, province) => {
        return new Promise((resolve, reject) => {
            if (this.province != province) {
                let keyword = this.keyword;
                this.removeMarkers();
                this.keyword = "";
                this.province = province;
                this.changeMapProvince(() => {
                    if (keyword != data) {
                        this.keyword = data;
                        this.removeMarkers();
                        if (this.keyword == null || this.keyword.toString().trim() == "") {
                            this.resetToPosition();
                            return;
                        }
                        this.getSceneryData();
                    }
                });
            } else {
                if (this.keyword != data) {
                    this.keyword = data;
                    this.removeMarkers();
                    if (this.keyword == null || this.keyword.toString().trim() == "") {
                        this.resetToPosition();
                        return;
                    }
                    this.getSceneryData();
                }
            }
            resolve();
        });
    }
}
