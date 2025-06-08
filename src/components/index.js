import { Autocomplete, AutocompleteSettings } from './autocomplete.js';
import { Button ,ButtonSettings} from './button.js';
import {  Checkbox, CheckboxSettings } from './checkboxgroup.js';
import { DateField, DateFieldSettings } from './Datefield.js';
import { Header, HeaderSettings } from './Header.js';
import { UploadFile, UploadFileSettings } from './uploadfile.js';
import { fieldset, fieldsetSettings } from './Fieldset.js';


export const formComponents = {
    autocomplete: Autocomplete,
    autocompleteSettings: AutocompleteSettings,
    button: Button,
    buttonSettings: ButtonSettings,
    checkbox: Checkbox,
    checkboxSettings: CheckboxSettings,
    datefield: DateField,
    datefieldSettings: DateFieldSettings,
    uploadfile: UploadFile,
    uploadfileSettings: UploadFileSettings,
    header: Header,
    headerSettings: HeaderSettings,
    fieldsetSettings: fieldsetSettings,
    fieldset:fieldset
};
