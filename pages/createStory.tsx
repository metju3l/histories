import { Button } from '@components/Button';
import { Layout } from '@components/Layout';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  time: number;
  text: string;
};

const CreateStory = () => {
  const [events, setEvents] = useState<Array<Inputs>>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ time: string; text: string }>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // create temporary variable for the new events
    const tmp = events;
    // add the new event to the temporary variable
    tmp.push(data);
    // set the new events
    setEvents(
      // sort events chronologically
      tmp.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      )
    );
    // reset form
    reset({ text: '', time: '' });
  };

  return (
    <Layout title="Create story">
      <div className="w-full pt-40 m-auto max-w-7xl">
        <input
          className="h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none w-96 focus:outline-none focus:shadow-outline"
          {...register('text', { required: true })}
          placeholder="My new story"
        />
        <div className="p-4 mb-4 bg-secondary rounded-xl">
          {events.map((event, index) => (
            <div className="flex " key={index}>
              <TimeLineComponent {...event} />
              <Button
                text="x"
                isLoading={false}
                onClick={() => {
                  // create temporary variable for the new events
                  const tmp = events;
                  // set events to the new events without the event
                  setEvents(tmp.filter((e) => e !== event));
                }}
              />
            </div>
          ))}
          <div className="flex items-center w-full py-4 pl-16 border-l border-gray-500 border-dashed">
            <div className="flex w-full ml-[-4.5em] text-primary">
              <div className="w-4 h-4 mt-5 mr-2 border-2 border-gray-500 rounded-full bg-primary" />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-60">
                  <input
                    className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
                    type="datetime-local"
                    {...register('time')}
                  />
                </div>
                <div className="flex items-center w-[800px] gap-4">
                  <input
                    className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
                    {...register('text', { required: true })}
                    placeholder="Event description"
                  />
                </div>

                <Button isLoading={false} text="submit" />
              </form>
            </div>
          </div>
        </div>
        <Button isLoading={false} text="submit" />
      </div>
    </Layout>
  );
};

const TimeLineComponent: React.FC<Inputs> = ({ text, time }) => {
  const month = new Date(time).toLocaleDateString('en-us', {
    month: 'short',
  });
  const day = new Date(time).toLocaleDateString('en-us', {
    day: '2-digit',
  });
  const year = new Date(time).toLocaleDateString('en-us', {
    year: 'numeric',
  });

  return (
    <div className="flex items-center py-4 pl-16 pr-4 border-l border-gray-500 border-dashed">
      <div className="flex ml-[-4.5em] text-primary">
        <div className="w-4 h-4 mr-2 border-2 border-gray-500 rounded-full mt-1.5 bg-primary" />
        <div>
          <h2>
            {day}. {month}. {year}
          </h2>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
