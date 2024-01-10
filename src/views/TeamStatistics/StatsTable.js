import React from 'react';
import PropTypes from 'prop-types';
import Table from 'components/Table';

function StatsTable({ label, ...props }) {
  return (
    <div className="statistics">
      <h3 className="statistics__title">{label}</h3>
      <Table hovered striped {...props} className="statistics__table" />
    </div>
  );
}

StatsTable.propTypes = {
  label: PropTypes.string.isRequired
};

export default StatsTable;
