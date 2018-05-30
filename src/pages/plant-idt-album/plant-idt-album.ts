import {Component} from '@angular/core';
import {App, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {PlantDetailPage} from "../plant-detail/plant-detail";
import {Toast} from "@ionic-native/toast";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {GlobalProvider} from "../../providers/global/global";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

/**
 * Generated class for the PlantIdtAlbumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-plant-idt-album',
    templateUrl: 'plant-idt-album.html',
})
export class PlantIdtAlbumPage {
    private loading: Loading;
    private imageData: string;
    data: Object;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private camera: Camera, private permissions: AndroidPermissions,
                private loadingCtl: LoadingController, private network: GlobalProvider,
                public app: App, private sqlite: SQLite) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PlantIdtPhotoPage');
    }

    jumpToDetail() {
        this.app.getRootNav().push(PlantDetailPage,
            {
                data: this.data,
                imageData: this.imageData,
                index: 0
            });
    }

    /**
     * 打开摄像头
     */
    openCamera() {
        const options: CameraOptions = {
            quality: 90,                                                   //相片质量 0 -100
            destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: false,                                       //是否保存到相册
            allowEdit: true,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
            targetWidth: 500,                                        //照片宽度
            targetHeight: 500,                                       //照片高度
        };

        this.camera.getPicture(options).then((imageData) => {
            // console.log("got file: " + imageData);

            this.presentLoading();

            // If it's base64:
            this.imageData = 'data:image/jpeg;base64,' + imageData;
            this.network.getPlantList(imageData, (data, error) => {
                if (data) {
                    this.data = data;

                    // 数据缓存，用于历史记录
                    this.data['image'] = this.imageData;
                    this.saveData();

                    this.dismissLoading();
                    this.jumpToDetail();
                }

                if (error) {
                    console.log("network error: " + JSON.stringify(error));
                    this.dismissLoading();
                }
            });
        }, (err) => {
            console.log('打开相机失败: ' + err);
        });
    }

    requestWriteFilePermission(func) {
        if (/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)) {
            //ios调整样式
        } else {
            //android调整样式
            this.permissions.checkPermission(this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                result => {
                    if (!result.hasPermission) {
                        this.permissions.requestPermission(this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
                            result => {
                                if (!result.hasPermission) {
                                    console.log("未获取写数据权限");
                                } else {
                                    func();
                                }
                            }
                        );
                    } else {
                        func();
                    }
                }
            );
        }
    }

    presentLoading() {
        let loading = this.loadingCtl.create({
            content: ""
        });
        loading.present();
        this.loading = loading;
    }

    dismissLoading() {
        if (this.loading != null) {
            this.loading.dismiss();
            this.loading = null;
        }
    }

    saveData() {
        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS identification(id INTEGER PRIMARY KEY, data TEXT)', {})
                .then(res => console.log('Executed SQL'))
                .catch(e => console.log(e));
            db.executeSql('INSERT INTO identification VALUES(NULL, ?)',
                [JSON.stringify(this.data)])
                .then(res => console.log(res))
                .catch(e => console.log(e));
        }).catch(e => console.log(e));
    }
}
