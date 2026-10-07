import { useState } from 'react';
import { ComboBox, Textbox } from '../../../components';

export function EducationSearchCriteria({ topicOptions, recipientOptions }: {
    topicOptions: string,
    recipientOptions: string
}) {
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [selectedRecipient, setSelectedRecipient] = useState<string>('');

    return (
        <div className="flex flex-col gap-3">
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Students Educated</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="student-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="student-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
            <ComboBox
                label="Educational Topic"
                searchInputId="topic-combobox-input"
                listboxId="topic-list"
                buttonId="topic-toggle"
                value={selectedTopic}
                listAriaLabel="Topics"
                options={topicOptions}
                isRequired={false}
                autocomplete="list"
                handleChange={setSelectedTopic}>
            </ComboBox>
            <ComboBox
                label="Education Recipient"
                searchInputId="recipient-combobox-input"
                listboxId="recipient-list"
                buttonId="recipient-toggle"
                value={selectedRecipient}
                listAriaLabel="Recipients"
                options={recipientOptions}
                isRequired={false}
                autocomplete="list"
                handleChange={setSelectedRecipient}>
            </ComboBox>
            <fieldset>
                <legend><p className="text-[1.06rem] font-semibold">Number of Volunteers</p></legend>
                <div className="flex flex-row gap-4">
                    <Textbox
                        inputId="vol-count-min"
                        inputType="number"
                        labelText="Minimum"
                        labelFontWeight="font-normal">
                    </Textbox>
                    <Textbox
                        inputId="vol-count-max"
                        inputType="number"
                        labelText="Maximum"
                        labelFontWeight="font-normal">
                    </Textbox>
                </div>
            </fieldset>
        </div>
    );
}