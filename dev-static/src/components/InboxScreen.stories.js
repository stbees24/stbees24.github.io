import InboxScreen from './InboxScreen.svelte';

 import { fireEvent, within } from '@storybook/test';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};

 export const WithInteractions = {
   play: async (arg) => {
     console.log(within);
     console.log(arg);
     let canvasElement = arg.canvasElement;
    const canvas = within(canvasElement);
    // Simulates pinning the first task
    let click_result = await fireEvent.click(canvas.getByLabelText('pinTask-1'));
    console.log("click_result", click_result);
    // Simulates pinning the third task
    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
  },
 };
