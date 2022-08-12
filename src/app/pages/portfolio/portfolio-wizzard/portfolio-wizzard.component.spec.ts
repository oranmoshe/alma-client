import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioWizzardComponent } from './portfolio-wizzard.component';

describe('PortfolioWizzardComponent', () => {
  let component: PortfolioWizzardComponent;
  let fixture: ComponentFixture<PortfolioWizzardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioWizzardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioWizzardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
