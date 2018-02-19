import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApplicationFieldsService } from '../../../application-forms/_services/application-fields.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ChristmasTreesApplicationService } from '../../_services/christmas-trees-application.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilService } from '../../../_services/util.service';
import { Observable } from 'rxjs/Observable';
import { AdminDistrictDatesComponent } from './district-dates.component';
import { WindowRef } from '../../../_services/native-window.service';
import { TreesAdminService } from '../trees-admin.service';
import { MockRouter } from '../../../_mocks/routes.mock';
import { ForestService } from '../../_services/forest.service';

describe('District Dates Admin Component', () => {
  let component: AdminDistrictDatesComponent;
  let fixture: ComponentFixture<AdminDistrictDatesComponent>;
  let formBuilder: FormBuilder;

  class MockWindowRef {
    location = { hash: 'WAOW-MOCK-HASH' };
    getNativeWindow() {
      return { scroll() {} };
    }
  }

  const forests = [
    {
      id: 1,
      forestName: 'Arapaho and Roosevelt National Forests',
      description: 'Arapaho & Roosevelt | Colorado | Fort Collins, CO',
      forestAbbr: 'arp',
      startDate: '10/30/2018',
      endDate: '9/30/2019',
      cuttingAreas: {
        'ELKCREEK': {'startDate': '2017-12-02 15:30:00Z', 'endDate': '2017-12-09 21:30:00Z'},
        'REDFEATHERLAKES': {'startDate': '2017-12-02 15:30:00Z', 'endDate': '2017-12-10 21:30:00Z'},
        'SULPHUR': {'startDate': '2017-11-01 12:00:00Z', 'endDate': '2018-01-06 21:30:00Z'},
        'CANYONLAKES': {'startDate': '2017-11-27 15:30:00Z', 'endDate': '2017-12-10 21:30:00Z'}
      },
      timezone: 'America/Denver'
    },
    {
      id: 2,
      forestName: 'Flathead National Forest',
      description: 'Flathead | Montana | Kalispell, MT',
      forestAbbr: 'flathead',
      startDate: '10/31/2018',
      endDate: '9/30/2019'
    },
    {
      id: 3,
      forestName: 'Mt. Hood National Forest',
      description: 'Mt. Hood | Oregon | Portland, OR',
      forestAbbr: 'mthood'
    },
    {
      id: 4,
      forestName: 'Shoshone National Forest',
      description: 'Shoshone | Montana, Wyoming | Cody, WY, Jackson, WY',
      forestAbbr: 'shoshone'
    }
  ];

  class MockForestService {
    getOne(): Observable<{}> {
      return Observable.of(forests[0]);
    }
  }

  const mockActivatedRoute = {
    params: Observable.of({ id: 1 }),
    data: Observable.of({
      user: { email: 'test@test.com', role: 'admin', forests: ['arp', 'mthood', 'flathead'] },
      forests: forests
    })
  };

  class MockApplicationService {
    getAllByDateRange(): Observable<{}> {
      return Observable.of({
        parameters: {
          forestName: 'Arapaho and Roosevelt National Forests',
          startDate: '10/10/2018',
          endDate: '10/10/2019',
          sumOfTrees: '12',
          sumOfCost: '100'
        }
      });
    }

    updateDistrictDates(): Observable<{}> {
      return Observable.of({});
    }

    updateSeasonDates(): Observable<{}> {
      return Observable.of({});
    }
  }



  describe('', () => {
    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          declarations: [AdminDistrictDatesComponent],
          providers: [
            ApplicationFieldsService,
            {provide: ChristmasTreesApplicationService, useClass: MockApplicationService},
            {provide: ForestService, useClass: MockForestService },
            FormBuilder,
            RouterTestingModule,
            TreesAdminService,
            UtilService,
            {provide: WindowRef, useClass: MockWindowRef}
          ],
          imports: [RouterTestingModule, HttpClientTestingModule],
          schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      })
    );

    beforeEach(() => {
      TestBed.overrideProvider(ActivatedRoute, {useValue: mockActivatedRoute});
      fixture = TestBed.createComponent(AdminDistrictDatesComponent);
      component = fixture.debugElement.componentInstance;
      formBuilder = new FormBuilder();

      component.form = formBuilder.group({
        forestAbbr: ['', [Validators.required]],
        districtId: [''],
        dateTimeRange: formBuilder.group({
          endDateTime: [''],
          endDay: [''],
          endMonth: [''],
          endYear: [''],
          endHour: [''],
          endMinutes: ['00'],
          endPeriod: [''],
          startDateTime: [''],
          startDay: [''],
          startMonth: [''],
          startYear: [''],
          startHour: [''],
          startMinutes: ['00'],
          startPeriod: ['']
        })
      });

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should update district dates', () => {
      component.updateStatus = '';
      component.forest = component.forests.find(forest => forest.id === 1);


      component.dateStatus.hasErrors = false;
      component.form.get('forestAbbr').setValue('1');
      component.form.get('districtId').setValue('ELKCREEK');
      component.form.get('dateTimeRange.startMonth').setValue('10');
      component.form.get('dateTimeRange.startDay').setValue('10');
      component.form.get('dateTimeRange.startYear').setValue('2017');
      component.form.get('dateTimeRange.endMonth').setValue('10');
      component.form.get('dateTimeRange.endDay').setValue('10');
      component.form.get('dateTimeRange.endYear').setValue('2018');
      component.form.get('dateTimeRange.startHour').setValue('08');
      component.form.get('dateTimeRange.startMinutes').setValue('30');
      component.form.get('dateTimeRange.startPeriod').setValue('AM');
      expect(component.form.valid).toBeTruthy();
      component.updateSeasonDates();
    });

    it('should update date status', () => {
      component.updateDateStatus({
        startDateTimeValid: false,
        endDateTimeValid: false,
        startBeforeEnd: false,
        startAfterToday: false,
        hasErrors: false,
        dateTimeSpan: 0
      });
      expect(component.dateStatus).toEqual({
        startDateTimeValid: false,
        endDateTimeValid: false,
        startBeforeEnd: false,
        startAfterToday: false,
        hasErrors: false,
        dateTimeSpan: 0
      });
    });

    it('should set start and end dates', () => {
      component.forest = component.forests.find(forest => forest.id === 1);
      component.district = component.forest.cuttingAreas.ELKCREEK;

      component.setStartEndDate(component.forest, component.district, component.form);
      expect(component.form.get('dateTimeRange.startMonth').value).toEqual('12');
      expect(component.form.get('dateTimeRange.startDay').value).toEqual('02');
      expect(component.form.get('dateTimeRange.startYear').value).toEqual('2017');

      expect(component.form.get('dateTimeRange.startHour').value).toEqual('08');
      expect(component.form.get('dateTimeRange.startMinutes').value).toEqual('30');
      expect(component.form.get('dateTimeRange.startPeriod').value).toEqual('AM');

      expect(component.form.get('dateTimeRange.endMonth').value).toEqual('12');
      expect(component.form.get('dateTimeRange.endDay').value).toEqual('09');
      expect(component.form.get('dateTimeRange.endYear').value).toEqual('2017');

      expect(component.form.get('dateTimeRange.endHour').value).toEqual('02');
      expect(component.form.get('dateTimeRange.endMinutes').value).toEqual('30');
      expect(component.form.get('dateTimeRange.endPeriod').value).toEqual('PM');


    });
  });

  describe('user check', () => {
    let mockRouter: MockRouter;

    const mockNoForestsActivatedRoute = {
      params: Observable.of(
        {id: 1}
      ),
      data: Observable.of(
        {
          user: {email: 'test@test.com', role: 'admin', forests: []},
          forests: []
        }
      )
    };

    beforeEach(
      async(() => {
        mockRouter = new MockRouter();
        TestBed.configureTestingModule({
          declarations: [AdminDistrictDatesComponent],
          providers: [
            ApplicationFieldsService,
            {provide: ChristmasTreesApplicationService, useClass: MockApplicationService},
            ForestService,
            FormBuilder,
            {provide: Router, useValue: mockRouter},
            {provide: ActivatedRoute, useValue: mockNoForestsActivatedRoute},
            TreesAdminService,
            UtilService,
            {provide: WindowRef, useClass: MockWindowRef}
          ],
          imports: [HttpClientTestingModule],
          schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(AdminDistrictDatesComponent);
      component = fixture.debugElement.componentInstance;
      formBuilder = new FormBuilder();
      component.form = formBuilder.group({
        forestAbbr: ['', [Validators.required]],
        districtId: [''],
        dateTimeRange: formBuilder.group({
          endDateTime: [''],
          endDay: [''],
          endMonth: [''],
          endYear: [''],
          endHour: [''],
          endMinutes: ['00'],
          endPeriod: [''],
          startDateTime: [''],
          startDay: [''],
          startMonth: [''],
          startYear: [''],
          startHour: [''],
          startMinutes: ['00'],
          startPeriod: ['']
        })
      });

    });

    it('should send a user with no forests to access denied', () => {
      fixture.detectChanges();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['access-denied']);
    });
  });

  describe('user check', () => {
    let mockRouter: MockRouter;

    const mockNoForestsActivatedRoute = {
      params: Observable.of(
        {id: 1}
      ),
      data: Observable.of(
        {
          user: {email: 'test@test.com', role: 'admin'},
          forests: []
        }
      )
    };

    beforeEach(
      async(() => {
        mockRouter = new MockRouter();
        TestBed.configureTestingModule({
          declarations: [AdminDistrictDatesComponent],
          providers: [
            ApplicationFieldsService,
            {provide: ChristmasTreesApplicationService, useClass: MockApplicationService},
            ForestService,
            FormBuilder,
            {provide: Router, useValue: mockRouter},
            {provide: ActivatedRoute, useValue: mockNoForestsActivatedRoute},
            TreesAdminService,
            UtilService,
            {provide: WindowRef, useClass: MockWindowRef}
          ],
          imports: [HttpClientTestingModule],
          schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(AdminDistrictDatesComponent);
      component = fixture.debugElement.componentInstance;
      formBuilder = new FormBuilder();
      component.form = formBuilder.group({
        forestAbbr: ['', [Validators.required]],
        districtId: [''],
        dateTimeRange: formBuilder.group({
          endDateTime: [''],
          endDay: [''],
          endMonth: [''],
          endYear: [''],
          endHour: [''],
          endMinutes: ['00'],
          endPeriod: [''],
          startDateTime: [''],
          startDay: [''],
          startMonth: [''],
          startYear: [''],
          startHour: [''],
          startMinutes: ['00'],
          startPeriod: ['']
        })
      });

    });


    it('should send a user with null forests to access denied', () => {
      fixture.detectChanges();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['access-denied']);
    });

  });

  describe('user check', () => {
    let mockRouter: MockRouter;

    const mockForestsActivatedRoute = {
      params: Observable.of(
        { id: 1 }
      ),
      data: Observable.of(
        {
          user: { email: 'test@test.com', role: 'admin', forests: ['all'] },
          forests: [
            {
              id: 1,
              forestName: 'Arapaho and Roosevelt National Forests',
              description: 'Arapaho & Roosevelt | Colorado | Fort Collins, CO',
              forestAbbr: 'arp',
              startDate: '10/30/2018',
              endDate: '9/30/2019',
              cuttingAreas: {
                'ELKCREEK': {'startDate': '2017-12-02 15:30:00Z', 'endDate': '2017-12-09 21:30:00Z'},
                'REDFEATHERLAKES': {'startDate': '2017-12-02 15:30:00Z', 'endDate': '2017-12-10 21:30:00Z'},
                'SULPHUR': {'startDate': '2017-11-01 12:00:00Z', 'endDate': '2018-01-06 21:30:00Z'},
                'CANYONLAKES': {'startDate': '2017-11-27 15:30:00Z', 'endDate': '2017-12-10 21:30:00Z'}
              },
              timezone: 'America/Denver'
            }
          ]
        }
      )
    };

    beforeEach(
      async(() => {
        mockRouter = new MockRouter();
        TestBed.configureTestingModule({
          declarations: [AdminDistrictDatesComponent],
          providers: [
            ApplicationFieldsService,
            {provide: ChristmasTreesApplicationService, useClass: MockApplicationService},
            ForestService,
            FormBuilder,
            {provide: Router, useValue: mockRouter},
            {provide: ActivatedRoute, useValue: mockForestsActivatedRoute},
            TreesAdminService,
            UtilService,
            {provide: WindowRef, useClass: MockWindowRef}
          ],
          imports: [HttpClientTestingModule],
          schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(AdminDistrictDatesComponent);
      component = fixture.debugElement.componentInstance;
      formBuilder = new FormBuilder();
      component.form = formBuilder.group({
        forestAbbr: ['', [Validators.required]],
        districtId: [''],
        dateTimeRange: formBuilder.group({
          endDateTime: [''],
          endDay: [''],
          endMonth: [''],
          endYear: [''],
          endHour: [''],
          endMinutes: ['00'],
          endPeriod: [''],
          startDateTime: [''],
          startDay: [''],
          startMonth: [''],
          startYear: [''],
          startHour: [''],
          startMinutes: ['00'],
          startPeriod: ['']
        })
      });

    });

    it ('should work for a user with all forests', () => {
      fixture.detectChanges();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

  });
});
