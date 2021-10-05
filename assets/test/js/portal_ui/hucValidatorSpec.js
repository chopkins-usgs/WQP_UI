import HucValidator from '../../../js/HucValidator.vue';
import { shallowMount } from '@vue/test-utils';

describe('Tests hucValidator', function () {
    describe('Tests for hucValidator.validate', function () {
        let wrapper;

        beforeEach(() => {
            wrapper = shallowMount(HucValidator);
        })

        it('Expects an empty string to be valid', function () {
            expect(wrapper.vm.validate('').isValid).toBe(true);
        });

        it('Expects huc value with more than 12 characters to be invalid', function () {
            var result = wrapper.vm.validate('1234567890123');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('123456789012*');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
        });

        it('Expects huc value to be 2, 4, 6, 8, 10, or 12 digits', function () {
            var result = wrapper.vm.validate('123');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('123*');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('1');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('12345');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('1234567*');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('123456789*');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('12345678901*');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
        });

        it('Expects huc value which contains non numerical characters to be invalid', function () {
            var result = wrapper.vm.validate('A12345');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('1234-567');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
        });

        it('Expects huc value with "*" at the end of the value to be valid', function () {
            expect(wrapper.vm.validate('123456*').isValid).toBe(true);
        });

        it('Expects huc value with "*" anywhere but the end to be invalid', function () {
            var result = wrapper.vm.validate('12*4500');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
        });

        it('Expects multiple huc values to be separated by semi-colons', function () {
            var result = wrapper.vm.validate('12;34;45');
            expect(result.isValid).toBe(true);

            result = wrapper.vm.validate('12*;34;');
            expect(result.isValid).toBe(true);

        });

        it('Expects each huc value to be valid or the whole string is invalid', function () {
            var result = wrapper.vm.validate('12A;34;56');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('12*1;34;56');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();

            result = wrapper.vm.validate('12;123456789;56');
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toBeDefined();
        });
    });

    describe('Tests for hucValidator.format', function () {
        let wrapper;

        beforeEach(() => {
            wrapper = shallowMount(HucValidator);
        })

        it('Expects null string to be returned without change', function () {
            expect(wrapper.vm.format('')).toEqual('');
        });

        it('Expects hucs of length 8 to be returned as is', function () {
            expect(wrapper.vm.format('01234567')).toEqual('01234567');
            expect(wrapper.vm.format('01010101;02020202'));
        });

        it('Expects hucs that end with a wildcard to be returned as is', function () {
            expect(wrapper.vm.format('0123*')).toEqual('0123*');
            expect(wrapper.vm.format('01*;01234567;0202*')).toEqual('01*;01234567;0202*');
            expect(wrapper.vm.format('010203*')).toEqual('010203*');
        });

        it('Expects hucs that are less than 8 chars but don\'t end with a "*" to have the wildcard added', function () {
            expect(wrapper.vm.format('0123')).toEqual('0123*');
            expect(wrapper.vm.format('01;020506;12345678')).toEqual('01*;020506*;12345678');
        });

        it('Expects that trailing semi-colons will be removed', function () {
            expect(wrapper.vm.format('01;0203;')).toEqual('01*;0203*');
            expect(wrapper.vm.format('01;;0203')).toEqual('01*;0203*');
        });

    });
});
