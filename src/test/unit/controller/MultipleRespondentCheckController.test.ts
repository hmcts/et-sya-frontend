import MultipleRespondentCheckController from "../../../main/controllers/MultipleRespondentCheckController";
import sinon from "sinon";
import { Response } from 'express';
import { mockRequest } from "../mocks/mockRequest";

const multipleResponseController = new MultipleRespondentCheckController();


describe('Mutiple Response Controller Tests', () => {
    const t = {
        "multiple-respondent-check": {},

    }

    it(`should render multiple respondent page`, () => {
        const response = ({ render: () => '' } as unknown) as Response;
        const request = mockRequest(t);

        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('multiple-respondent-check', request.t('multiple-respondent-check', { returnObjects: true }));

        multipleResponseController.get(request, response);
        responseMock.verify();


    });

    it(`should redirect \ when yes is selected`, () => {
        const response = { redirect: () => { return ''; } } as unknown as Response;
        const request = mockRequest(t);

        request.body = { 'more-than-one-respondent': 'yes' };

        const responseMock = sinon.mock(response);

        responseMock
            .expects('redirect')
            .once()
            .withArgs('/');

        multipleResponseController.post(request, response);
        responseMock.verify();


    });


    it(`should redirect \ when no is selected`, () => {
        const response = { redirect: () => { return ''; } } as unknown as Response;
        const request = mockRequest(t);

        request.body = { 'more-than-one-respondent': 'no' };

        const responseMock = sinon.mock(response);

        responseMock
            .expects('redirect')
            .once()
            .withArgs('/');

        multipleResponseController.post(request, response);
        responseMock.verify();


    });

    it(`should render same page if nothing selected`, () => {
        const response = ({ render: () => '' } as unknown) as Response;
        const request = mockRequest(t);
        request.body = { 'more-than-one-respondent': '' };

        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('multiple-respondent-check');

        multipleResponseController.post(request, response);
        responseMock.verify();


    });

});
