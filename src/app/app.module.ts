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
        MinePage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, {
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
        MinePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Toast,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {

}
