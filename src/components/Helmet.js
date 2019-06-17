import PropTypes from 'prop-types';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function LusHelmet({ title, description }) {
  return (
    <HelmetProvider>
      <Helmet title={title} titleTemplate="%s | Lusamine">
        <meta name="description" content={description} />
      </Helmet>
    </HelmetProvider>
  );
}

LusHelmet.displayName = 'AppHelmet';
LusHelmet.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default LusHelmet;
