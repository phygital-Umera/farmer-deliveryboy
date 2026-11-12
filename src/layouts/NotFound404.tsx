const NotFound404: React.FC = () => {
  return (
    <section className="dark:bg-text-charcoal grid h-screen place-content-center bg-pure-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl">
            404
          </h1>
          <p className="text-text-charcoal mb-4 text-3xl font-bold tracking-tight dark:text-pure-white md:text-4xl">
            Something's missing.
          </p>
          <p className="text-text-charcoal dark:text-text-charcoal mb-4 text-lg font-light">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{' '}
          </p>
          <a
            href="#"
            className="bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-pure-white focus:outline-none focus:ring-4"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
};

export default NotFound404;
