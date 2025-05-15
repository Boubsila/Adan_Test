import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HusnaCardService } from '../../services/husna-card.service';

@Component({
  selector: 'app-husna-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './husna-card.component.html',
  styleUrls: ['./husna-card.component.css']
})
export class HusnaCardComponent implements OnInit {
  // Time and Date
  currentTime = '';
  gregorianDate = '';
  hijriDate = '';
  country = 'Belgium';
  method = 3;

  // City selection
  selectedCity = 'antwerp';
  cities = [
    { name: 'Anvers', value: 'antwerp' },
    { name: 'Bruxelles', value: 'brussels' },
    { name: 'Paris', value: 'paris' },
    { name: 'Londres', value: 'london' },
    { name: 'Dubai', value: 'dubai' },
    { name: 'Istanbul', value: 'istanbul' },
    { name: 'Casablanca', value: 'casablanca' },
    { name: 'Alger', value: 'algiers' },
    { name: 'Tunis', value: 'tunis' },
    { name: 'Mekkah', value: 'makkah' }
  ];

  // Asma ul Husna
  husnaName = '';
  husnaTransliteration = '';
  husnaMeaning = '';

  // Prayer Times
  fajr = '';
  dhuhr = '';
  asr = '';
  maghrib = '';
  isha = '';
  activePrayer = '';

  constructor(private husnaService: HusnaCardService) {}

  ngOnInit(): void {
    this.loadHusnaRotation();
    this.updateTimeEverySecond();
    this.fetchPrayerTimes();
  }

  // Updates time every second
  updateTimeEverySecond() {
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.currentTime = `${hours}:${minutes}:${seconds}`;
      
      // Update Gregorian date
      this.gregorianDate = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      this.updateActivePrayer(`${hours}:${minutes}`);
    }, 1000);
  }

  // Rotates through names every 3 seconds
  loadHusnaRotation() {
    let counter = 1;
    this.fetchHusna(counter); // First call

    setInterval(() => {
      counter = counter < 99 ? counter + 1 : 1;
      this.fetchHusna(counter);
    }, 3000);
  }

  fetchHusna(id: number) {
    this.husnaService.getHusna(id).subscribe({
      next: (data) => {
        const husna = data?.data?.[0];
        if (husna) {
          this.husnaName = husna.name;
          this.husnaTransliteration = husna.transliteration;
          this.husnaMeaning = husna.en?.meaning;
        }
      },
      error: (err) => {
        console.error('Error fetching Asma ul Husna:', err);
      }
    });
  }

  fetchPrayerTimes() {
    this.husnaService.getmawaqit(this.selectedCity, this.country, this.method).subscribe({
      next: (data) => {
        const timings = data.data.timings;
        const hijri = data.data.date.hijri;
        const gregorian = data.data.date.gregorian;

        this.fajr = this.formatTime(timings.Fajr);
        this.dhuhr = this.formatTime(timings.Dhuhr);
        this.asr = this.formatTime(timings.Asr);
        this.maghrib = this.formatTime(timings.Maghrib);
        this.isha = this.formatTime(timings.Isha);

        this.hijriDate = `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year}`;
        
        // Update country if available
        if (data.data.meta?.timezone) {
          const parts = data.data.meta.timezone.split('/');
          if (parts.length > 1) {
            this.country = parts[1].replace(/_/g, ' ');
          }
        }
      },
      error: (err) => {
        console.error('Error fetching prayer times:', err);
      }
    });
  }

  formatTime(time: string): string {
    return time.split(' ')[0]; // Remove timezone if exists
  }

  onCityChange() {
    this.fetchPrayerTimes();
  }

  updateActivePrayer(current: string) {
    if (!this.fajr || !this.dhuhr || !this.asr || !this.maghrib || !this.isha) return;

    const currentTime = this.timeToMinutes(current);
    const fajrTime = this.timeToMinutes(this.fajr);
    const dhuhrTime = this.timeToMinutes(this.dhuhr);
    const asrTime = this.timeToMinutes(this.asr);
    const maghribTime = this.timeToMinutes(this.maghrib);
    const ishaTime = this.timeToMinutes(this.isha);

    if (currentTime >= fajrTime && currentTime < dhuhrTime) {
      this.activePrayer = 'fajr';
    } else if (currentTime >= dhuhrTime && currentTime < asrTime) {
      this.activePrayer = 'dhuhr';
    } else if (currentTime >= asrTime && currentTime < maghribTime) {
      this.activePrayer = 'asr';
    } else if (currentTime >= maghribTime && currentTime < ishaTime) {
      this.activePrayer = 'maghrib';
    } else if (currentTime >= ishaTime || currentTime < fajrTime) {
      this.activePrayer = 'isha';
    } else {
      this.activePrayer = '';
    }
  }

  timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getPrayerTimeText(prayer: string): string {
    switch (prayer) {
      case 'fajr': return 'وقت صلاة الفجر';
      case 'dhuhr': return 'وقت صلاة الضهر';
      case 'asr': return 'وقت صلاة العصر';
      case 'maghrib': return 'وقت صلاة المغرب';
      case 'isha': return 'وقت صلاة العشاء';
      default: return '...';
    }
  }
}