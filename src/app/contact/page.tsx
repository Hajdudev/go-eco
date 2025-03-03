'use client';
import { useState } from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className='bg-mist min-h-screen'>
      {/* Hero Section */}
      <div className='py-16 text-black'>
        <div className='mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
          <h1 className='text-4xl font-extrabold sm:text-5xl'>Contact Us</h1>
          <p className='mx-auto mt-4 max-w-3xl text-xl'>
            Have questions, feedback, or need assistance? We re here to help.
          </p>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Contact Information */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                Get in Touch
              </h2>

              <div className='space-y-6'>
                <div className='flex items-start'>
                  <MapPinIcon className='text-primary mt-1 h-6 w-6 flex-shrink-0' />
                  <div className='ml-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      Visit Us
                    </h3>
                    <p className='mt-1 text-gray-600'>
                      123 Transit Avenue
                      <br />
                      Eco City, EC 10001
                      <br />
                      Slovakia
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <PhoneIcon className='text-primary mt-1 h-6 w-6 flex-shrink-0' />
                  <div className='ml-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      Call Us
                    </h3>
                    <p className='mt-1 text-gray-600'>+421 123 456 789</p>
                    <p className='mt-1 text-gray-600'>+421 987 654 321</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <EnvelopeIcon className='text-primary mt-1 h-6 w-6 flex-shrink-0' />
                  <div className='ml-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      Email Us
                    </h3>
                    <p className='mt-1 text-gray-600'>info@goeco.com</p>
                    <p className='mt-1 text-gray-600'>support@goeco.com</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <ClockIcon className='text-primary mt-1 h-6 w-6 flex-shrink-0' />
                  <div className='ml-4'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      Working Hours
                    </h3>
                    <p className='mt-1 text-gray-600'>
                      Monday - Friday: 9:00 AM - 5:00 PM
                    </p>
                    <p className='mt-1 text-gray-600'>
                      Saturday: 10:00 AM - 2:00 PM
                    </p>
                    <p className='mt-1 text-gray-600'>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className='mt-8'>
                <h3 className='mb-4 text-lg font-medium text-gray-900'>
                  Follow Us
                </h3>
                <div className='flex space-x-4'>
                  <a href='#' className='hover:text-primary text-gray-500'>
                    <span className='sr-only'>Facebook</span>
                    <svg
                      className='h-6 w-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path
                        fillRule='evenodd'
                        d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </a>

                  <a href='#' className='hover:text-primary text-gray-500'>
                    <span className='sr-only'>Instagram</span>
                    <svg
                      className='h-6 w-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path
                        fillRule='evenodd'
                        d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </a>

                  <a href='#' className='hover:text-primary text-gray-500'>
                    <span className='sr-only'>Twitter</span>
                    <svg
                      className='h-6 w-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                    </svg>
                  </a>

                  <a href='#' className='hover:text-primary text-gray-500'>
                    <span className='sr-only'>LinkedIn</span>
                    <svg
                      className='h-6 w-6'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-6 text-2xl font-bold text-gray-900'>
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <div className='rounded-md border border-green-200 bg-green-50 p-6 text-center'>
                  <svg
                    className='mx-auto h-12 w-12 text-green-500'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  <h3 className='mt-4 text-xl font-medium text-green-800'>
                    Thank you!
                  </h3>
                  <p className='mt-2 text-green-700'>
                    Your message has been sent successfully. We will get back to
                    you as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className='mt-6 inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none'
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6'>
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Full name
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          name='name'
                          id='name'
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className='focus:border-primary focus:ring-primary block w-full rounded-md border-gray-300 px-1 py-1 shadow-sm sm:text-sm'
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Email address
                      </label>
                      <div className='mt-1'>
                        <input
                          type='email'
                          name='email'
                          id='email'
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className='focus:border-primary focus:ring-primary block w-full rounded-md border-gray-300 px-1 py-1 shadow-sm sm:text-sm'
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='subject'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Subject
                    </label>
                    <div className='mt-1'>
                      <select
                        id='subject'
                        name='subject'
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className='focus:border-primary focus:ring-primary block w-full rounded-md border-gray-300 px-1 py-1 shadow-sm sm:text-sm'
                      >
                        <option value=''>Select a topic</option>
                        <option value='General Inquiry'>General Inquiry</option>
                        <option value='Technical Support'>
                          Technical Support
                        </option>
                        <option value='Partnership Opportunity'>
                          Partnership Opportunity
                        </option>
                        <option value='Feedback'>Feedback</option>
                        <option value='Other'>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Message
                    </label>
                    <div className='mt-1'>
                      <textarea
                        id='message'
                        name='message'
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className='focus:border-primary focus:ring-primary block w-full rounded-md border-gray-300 px-1 py-1 shadow-sm sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <input
                      id='privacy-policy'
                      name='privacy-policy'
                      type='checkbox'
                      required
                      className='text-primary focus:ring-primary h-4 w-4 rounded border-gray-300'
                    />
                    <label
                      htmlFor='privacy-policy'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      I agree to the privacy policy and terms of service.
                    </label>
                  </div>

                  <div>
                    <button
                      type='submit'
                      disabled={isLoading}
                      className={`bg-primary hover:bg-primary-dark focus:ring-primary inline-flex w-full justify-center rounded-md border border-transparent px-4 py-3 text-sm font-bold text-black shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className='mr-2 -ml-1 h-4 w-4 animate-spin text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className='mt-12'>
          <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
            <div className='h-96 w-full'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d85049.91389549346!2d17.0522762801422!3d48.14354722633185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c89360aca6ac7%3A0x631f9b82fd884368!2sBratislava%2C%20Slovakia!5e0!3m2!1sen!2sus!4v1654325234153!5m2!1sen!2sus'
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='GoEco location map'
              ></iframe>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='mt-16'></div>
        <h2 className='mb-6 text-2xl font-bold text-gray-900'>
          Frequently Asked Questions
        </h2>

        <div className='overflow-hidden rounded-lg bg-white shadow-lg'></div>
        <div className='divide-y divide-gray-200'>
          <div className='p-6'>
            <h3 className='text-lg font-medium text-gray-900'>
              How can I report an issue with the app?
            </h3>
            <p className='mt-2 text-gray-600'>
              You can report any issues through the form above by selecting
              (Technical Support) as the subject, or by emailing
              support@goeco.com directly with details about the problem you re
              experiencing.
            </p>
          </div>

          <div className='p-6'></div>
          <h3 className='text-lg font-medium text-gray-900'>
            What are your customer service hours?
          </h3>
          <p className='mt-2 text-gray-600'>
            Our customer service team is available Monday through Friday from
            9:00 AM to 5:00 PM, and Saturdays from 10:00 AM to 2:00 PM. We re
            closed on Sundays and public holidays.
          </p>
        </div>

        <div className='p-6'></div>
        <h3 className='text-lg font-medium text-gray-900'>
          How can I become a partner?
        </h3>
        <p className='mt-2 text-gray-600'>
          We re always looking for new partners to help expand our network.
          Please contact us through the form above and select (Partnership
          Opportunity) as the subject. One of our team members will follow up
          with more information.
        </p>
      </div>
    </div>
  );
}

export default ContactPage;
