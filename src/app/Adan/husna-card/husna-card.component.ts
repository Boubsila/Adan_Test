import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HusnaCardService } from '../../services/husna-card.service';

@Component({
  selector: 'app-husna-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './husna-card.component.html',
  styleUrl: './husna-card.component.css'
})
export class HusnaCardComponent implements OnInit {

  counter = 1;
  name: string = '';
  transliteration: string = '';
  meaning: string= '';
  name2: string = '';
  transliteration2: string = '';
  meaning2: string= '';
  date = new Date();
  hours= this.date.getHours().toString().padStart(2, '0');
  minutes = this.date.getMinutes().toString().padStart(2, '0');
  seconds = this.date.getSeconds().toString().padStart(2, '0');
  Hours = this.hours + ' : ' + this.minutes + ' : ' + this.seconds;
  PrayerT= this.hours+':'+this.minutes;
  city = 'antwerp';
  country = 'belguim';
  method = 3;
  date2='';
  fajr = '';
  dhuhr = '';
  asr = '';
  maghrib = '';
  isha = '';
  hijriWeekday = '';
  hijriMonth = '';
  hijriYear = '';
  hijriDay = '';
  count:number =0;
  istime = '';
  

  constructor(private husna: HusnaCardService) {}

  ngOnInit(): void {


    setInterval(() => {
      this.date = new Date();
      this.hours= this.date.getHours().toString().padStart(2, '0');
      this.minutes = this.date.getMinutes().toString().padStart(2, '0');
      this.seconds = this.date.getSeconds().toString().padStart(2, '0');
      this.Hours = this.hours + ' : ' + this.minutes + ' : ' + this.seconds;
      this.PrayerT= this.hours+':'+this.minutes;
      this.istime=this.PrayerTimes();

    }, 1000);

   
  

    this.husna.getmawaqit(this.city, this.country, this.method).subscribe((d: any) => {
      this.date2 = d['data']['date']['gregorian']['date'],
      this.fajr = d['data']['timings']['Fajr'],
      this.dhuhr = d['data']['timings']['Dhuhr'],
      this.asr = d['data']['timings']['Asr'],
      this.maghrib = d['data']['timings']['Maghrib'],
      this.isha = d['data']['timings']['Isha'],
      this.hijriWeekday = d['data']['date']['hijri']['weekday']['ar'],
      this.hijriMonth = d['data']['date']['hijri']['month']['ar'],
      this.hijriYear = d['data']['date']['hijri']['year'];
      this.hijriDay = d['data']['date']['hijri']['day'];
      
      
    });

    
   
    
    this.husna.getHusna(this.counter).subscribe((d: any) => {
      this.name = d['data'][0].name,
      this.transliteration = d['data'][0].transliteration,
      this.meaning = d['data'][0].en['meaning'];
    });


    setInterval(() => {
      this.count=this.count+1;
      if (this.count> 99) {
        this.count = 1;
      }

      this.husna.getHusna(this.count).subscribe((d: any) => {
        this.name2 = d['data'][0].name,
        this.transliteration2 = d['data'][0].transliteration,
        this.meaning2 = d['data'][0].en['meaning'];
        
      });
    }

      , 3000);

      
  }

  PrayerTimes():string{
    if(this.PrayerT >=this.fajr && this.PrayerT < this.dhuhr){
      return "وقت صلاة الفجر";
    }else if(this.PrayerT >=this.dhuhr && this.PrayerT < this.asr){
      return "وقت صلاة الضهر";
    }else if(this.PrayerT >=this.asr && this.PrayerT < this.maghrib){
      return "وقت صلاة العصر";
    }else if(this.PrayerT >=this.maghrib && this.PrayerT < this.isha){
      return "وقت صلاة المغرب";
    }else {
      
      return "وقت صلاة العشاء";
    }
   
  }

  // PrayerTimes():string{
  //   if( this.PrayerT < this.dhuhr){
  //     return "وقت صلاة الفجر";
  //   }
  //   if( this.PrayerT < this.asr){
  //     return "وقت صلاة الضهر";
  //   }
  //   if( this.PrayerT < this.maghrib){
  //     return "وقت صلاة العصر";
  //   }if
  //   ( this.PrayerT < this.isha){
  //     return "وقت صلاة المغرب";
  //   }else {
      
  //     return "وقت صلاة العشاء";
  //   }
   
  // }
  
  
}
