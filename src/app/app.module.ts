import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {PlantListPage} from '../pages/plant-list/plant-list'

import {TitleBarComponent} from "../components/title-bar/title-bar";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Toast} from "@ionic-native/toast";
import {FindPage} from "../pages/find/find";
import {MinePage} from "../pages/mine/mine";
import {PlantIdtTabsPage} from "../pages/plant-idt-tabs/plant-idt-tabs";
import {PlantIdtAlbumPage} from "../pages/plant-idt-album/plant-idt-album";
import {PlantIdtPhotoPage} from "../pages/plant-idt-photo/plant-idt-photo";
import {PlantIdtHistoryPage} from "../pages/plant-idt-history/plant-idt-history";
import {PlantDetailPage} from "../pages/plant-detail/plant-detail";
import {Camera} from "@ionic-native/camera";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {GlobalProvider} from '../providers/global/global';
import {HTTP} from "@ionic-native/http";

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        TitleBarComponent,
        PlantListPage,
        FindPage,
        MinePage,
        PlantIdtTabsPage,
        PlantIdtAlbumPage,
        PlantIdtPhotoPage,
        PlantIdtHistoryPage,
        PlantDetailPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, {
            tabsHideOnSubPages: true,
            iconMode: 'ios',//  在整个应用程序中为所有图标使用的模式。可用选项："ios"，"md"
            mode: 'ios'//在整个应用程序中使用的模式。
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        PlantListPage,
        FindPage,
        MinePage,
        PlantIdtTabsPage,
        PlantIdtAlbumPage,
        PlantIdtPhotoPage,
        PlantIdtHistoryPage,
        PlantDetailPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Toast,
        Camera,
        AndroidPermissions,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        GlobalProvider,
        HTTP
    ]
})
export class AppModule {

}
