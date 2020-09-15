import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserFollowingPage } from './user-following.page';

describe('UserFollowingPage', () => {
  let component: UserFollowingPage;
  let fixture: ComponentFixture<UserFollowingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFollowingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFollowingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
