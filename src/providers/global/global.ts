import {Injectable} from '@angular/core';
import {HTTP, HTTPResponse} from "@ionic-native/http";

const BASEURL = "http://123.206.29.23:8080/";
const PLANT = "getPlant";
const PLANT_LIST = "getPlantList";

@Injectable()
export class GlobalProvider {

    constructor(public http: HTTP) {
        console.log('Hello GlobalProvider Provider');
    }

    /**
     * 获取植物列表
     */
    getPlantList(img): Promise<HTTPResponse> {
        return this.http.post(BASEURL + PLANT_LIST, {img: img}, {});
    }

    /**
     * 获取植物详情
     */
    getPlant(infoUrl): Promise<HTTPResponse> {
        return this.http.get(BASEURL + PLANT, {code: infoUrl}, {});
    }
}
