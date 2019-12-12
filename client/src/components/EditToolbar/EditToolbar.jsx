import React from 'react';
import PropTypes from 'prop-types';

import {
  Box, Typography, Button,
} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import styles from './EditToolbar.module.scss';


function EditToolbar({
  children, isEditting, setIsEditting, handleReset,
  setDialogType, setOpenDialog, isActiveStateChanged,
}) {
  return (
    <>
      {isEditting ? (
        <>
          <div className={styles.edit}>
            <div className={styles.editActions}>
              <Button
                color="primary"
                onClick={handleReset}
                className={styles.editAction}
              >
                  Cancel
              </Button>
              <Button
                color="primary"
                disabled={!isActiveStateChanged}
                onClick={() => {
                  setDialogType('save');
                  setOpenDialog(true);
                }}
                className={styles.editAction}
              >
                  Save
              </Button>
            </div>

            <Slide direction="right" in={isEditting} mountOnEnter unmountOnExit exit>
              <div>
                { children }
              </div>
            </Slide>
          </div>

        </>
      ) : (
        <Button
          color="primary"
          onClick={() => {
            setIsEditting(true);
          }}
          className={styles.editAction}
        >
              Edit
        </Button>
      )}
    </>
  );
}

EditToolbar.propTypes = {
  children: PropTypes.node.isRequired,
  isEditting: PropTypes.bool.isRequired,
  isActiveStateChanged: PropTypes.bool.isRequired,
  setIsEditting: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  setDialogType: PropTypes.func.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
};

export default EditToolbar;
