import {Injectable} from '@angular/core';
import {Toast} from "@ionic-native/toast";
import {HttpClient, HttpParams} from "@angular/common/http";
import {isObject} from "ionic-angular/util/util";

const BASEURL = "http://192.168.0.5:8080/";
const PLANT = "getPlant";
const PLANT_LIST = "getPlantList";
const DISEASE_LIST = "getDiseaseList";
const INSECT_LIST = "getInsectList";
const DISEASE_DETAIL = "getDisease";
const DISEASE_ALL = "findAllDiseases";
const INSECT_ALL = "findAllInsects";
const DISEASE_PLANT = "getPlantsFromDisease";
const MUCH_DISEASE_PLANT = "getMuchPlantsFromDisease";
const DISEASES = "getDiseasesByPlantId";
const INSECTS = "getInsectsByPlantId";
const PLANT_DESCRIPTION = "getPlantDescription";
const FIRST_DISEASE_QUESTION = "getFirstDiseaseQuestion";
const DISEASE_QUESTION = "getDiseaseQuestion";
const GET_DISEASE_BY_OPTION_ID = "getDiseaseByOptionId";
const GET_FAMILY = "getFamily";
const GET_GENUS = "getGenus";
const GET_PLANTS_BY_GENUS = "getPlantsByGenus";
const GET_PLANT_BY_ID = "getPlantById";
const GET_QUESTION_IDS = "getQuestionIds";
const GET_QUESTION_BY_ID = "getQuestionById";
const TEST = "testtest";

@Injectable()
export class GlobalProvider {
    public getBaseUrl() {
        return BASEURL;
    }

    constructor(public http: HttpClient, public toast: Toast) {
        // console.log('Hello GlobalProvider Provider');
    }

    // 将复杂的参数组装成字符串
    private paramsString(params: any): string {

        if (!params) return null;

        let str = "";

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                let value = params[key];
                if (value === null) continue;

                if (Array.isArray(value)) {
                    if (value.length === 0) continue;

                    for (let index = 0; index < value.length; index++) {
                        let k = key + "[" + index + "]";
                        let v = value[index];
                        if (str.length > 1) str += "&";
                        str += k + "=" + v;
                    }
                } else if (isObject(value)) {

                    for (let subKey in value) {
                        if (value.hasOwnProperty(subKey)) {
                            let v = value[subKey];
                            if (v === null) continue;

                            let k = key + "[" + subKey + "]";
                            if (str.length > 1) str += "&";
                            str += k + "=" + v;
                        }
                    }

                } else {
                    if (str.length > 1) str += "&";
                    str += key + "=" + value;
                }
            }
        }
        return str;
    }

    private encodeComplexHttpParams(params: any): any {
        if (!params) return null;
        return new HttpParams({fromString: this.paramsString(params)});
    }

    GET(url: string, params: any, callback ?: (res: any, error: any) => void): void {
        this.http.get(url, {params: this.encodeComplexHttpParams(params)})
            .subscribe(res => {
                    callback && callback(res, null);
                }, error => {
                    this.error(error);
                    callback && callback(null, error);
                }
            );

    }

    POST(url: string, params: any, callback ?: (res: any, error: any) => void): void {
        this.http.post(url, this.encodeComplexHttpParams(params))
            .subscribe(res => {
                callback && callback(res, null);
            }, error => {
                this.error(error);
                callback && callback(null, error);
            });
    }

    error(error) {
        if (JSON.stringify(error).match("timed out")) {
            this.toast.showShortCenter("网络请求失败").subscribe();
        } else {
            alert(JSON.stringify(error));
        }
    }

    /**
     * 获取植物列表
     */
    getPlantList(img, callback) {
        this.POST(BASEURL + PLANT_LIST, {img: img}, callback);
    }

    /**
     * 获取植物详情
     */
    getPlant(infoUrl, callback) {
        this.GET(BASEURL + PLANT, {code: infoUrl}, callback);
    }

    /**
     * 获取病害列表
     */
    getDiseaseList(name, page, callback) {
        this.GET(BASEURL + DISEASE_LIST, {name: name, page: page}, callback);
    }

    /**
     * 获取虫害列表
     */
    getInsectList(name, page, callback) {
        this.GET(BASEURL + INSECT_LIST, {name: name, page: page}, callback);
    }

    /**
     * 获取病虫害详情
     */
    getDiseaseDetail(id, callback) {
        this.GET(BASEURL + DISEASE_DETAIL, {id: id}, callback);
    }

    /**
     * 按照点击量获取病害列表
     */
    getAllDiseases(page, callback) {
        this.GET(BASEURL + DISEASE_ALL, {page: page}, callback);
    }

    /**
     * 按照点击量获取虫害列表
     */
    getAllInsects(page, callback) {
        this.GET(BASEURL + INSECT_ALL, {page: page}, callback);
    }

    /**
     * 病虫害搜索获取植物信息
     */
    getDiseasePlant(name, page, callback) {
        this.GET(BASEURL + DISEASE_PLANT, {name: name, page: page}, callback);
    }

    /**
     * 病虫害搜索获取植物信息
     */
    getMuchDiseasePlant(name, page, callback) {
        this.GET(BASEURL + MUCH_DISEASE_PLANT, {name: name, page: page, size: 1}, callback);
    }

    /**
     * 通过植物id获取病害列表
     */
    getDiseasesByPlantId(id, page, callback) {
        this.GET(BASEURL + DISEASES, {id: id, page: page}, callback);
    }

    /**
     * 通过植物id获取病害列表
     */
    getInsectsByPlantId(id, page, callback) {
        this.GET(BASEURL + INSECTS, {id: id, page: page}, callback);
    }

    /**
     * 病虫害搜索获取植物信息
     */
    getPlantDescription(id, callback) {
        this.GET(BASEURL + PLANT_DESCRIPTION, {id: id}, callback);
    }

    /**
     * 获取病虫害推理第一题
     */
    getFirstDiseaseQuestion(plantId, type, callback) {
        this.GET(BASEURL + FIRST_DISEASE_QUESTION, {plantId: plantId, type: type}, callback);
    }

    /**
     * 获取病虫害推理试题
     */
    getDiseaseQuestion(id, callback) {
        this.GET(BASEURL + DISEASE_QUESTION, {id: id}, callback);
    }

    /**
     * 通过最后一题选项id获取病虫害信息
     */
    getDiseaseByOptionId(id, callback) {
        this.GET(BASEURL + GET_DISEASE_BY_OPTION_ID, {id: id}, callback);
    }

    // const GET_FAMILY = "getFamily";
    // const GET_GENUS = "getGenus";
    // const GET_PLANTS_BY_GENUS = "getPlantsByGenus";
    // const GET_PLANT_BY_ID = "getPlantById";
    /**
     * 获取植物科与数量
     */
    getFamily(page, callback) {
        this.GET(BASEURL + GET_FAMILY, {page: page}, callback);
    }

    /**
     * 根据科获取植物属与数量
     */
    getGenus(family, page, callback) {
        this.GET(BASEURL + GET_GENUS, {family: family, page: page}, callback);
    }

    /**
     * 根据属获取植物列表
     */
    getPlantsByGenus(genus, page, callback) {
        this.GET(BASEURL + GET_PLANTS_BY_GENUS, {genus: genus, page: page}, callback);
    }

    /**
     * 根据id获取植物详情
     */
    getPlantById(id, callback) {
        this.GET(BASEURL + GET_PLANT_BY_ID, {id: id}, callback);
    }

    /**
     * 分页获取题目id
     */
    getQuestionIds(page, callback) {
        this.GET(BASEURL + GET_QUESTION_IDS, {page: page}, callback);
    }

    /**
     * 根据id获取题目信息
     */
    getQuestionById(id, callback) {
        this.GET(BASEURL + GET_QUESTION_BY_ID, {id: id}, callback);
    }

    // Dumplicate
    test(name, page, callback) {
        this.GET(BASEURL + TEST, {"name": "123", "page": 1}, callback);
    }
}
