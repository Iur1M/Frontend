import { Component } from '@angular/core';
import { ActivityService } from '../shared/activity.service';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrl: './activity-page.component.css',
})
export class ActivityPageComponent {
  activities: any[] = [];
  loading = true;

  constructor(private activity: ActivityService) {}

  ngOnInit() {
    this.activity.getMyHistory().subscribe((res) => {
      this.activities = res;
      this.loading = false;
    });
  }

  label(type: string) {
    return type === 'View' ? 'Viewed' : 'Commented';
  }
}