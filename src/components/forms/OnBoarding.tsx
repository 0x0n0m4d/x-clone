'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveUserAction } from '@/actions/user.action';
import { userSchema } from '@/validations/user.validation';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface InitialValueInterface {
  id: string;
  name: string;
  bio: string;
}

interface OnBoardingProps {
  initialValue: InitialValueInterface;
}

const OnBoarding = ({ initialValue }: OnBoardingProps) => {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: initialValue.id,
      name: initialValue.name,
      bio: initialValue.bio
    }
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    const newUser = {
      ...values,
      isCompleted: true
    };

    try {
      const data = await saveUserAction(newUser);
      if (!data) {
        return toast.error('Somithng went wrong!', {
          duration: 2000
        });
      }

      window.location.href = '/home';
    } catch (error) {
      console.log('[ERROR_ONBOARDING]', error);
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label className="font-bold" htmlFor="name">
                Name
              </Label>
              <FormControl>
                <Input
                  id="name"
                  className="onboarding__input"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <Label className="font-bold" htmlFor="bio">
                Bio
              </Label>
              <FormControl>
                <Textarea
                  id="bio"
                  className="onboarding__textarea"
                  disabled={isLoading}
                  rows={6}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          variant="primary"
          type="submit"
          className="w-full rounded-xl"
        >
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default OnBoarding;
