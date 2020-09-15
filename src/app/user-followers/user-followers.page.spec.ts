import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserFollowersPage } from './user-followers.page';

describe('UserFollowersPage', () => {
  let component: UserFollowersPage;
  let fixture: ComponentFixture<UserFollowersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFollowersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFollowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
