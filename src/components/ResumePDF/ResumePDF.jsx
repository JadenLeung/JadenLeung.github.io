import React from 'react'
import { getImageUrl } from '../../utils';
import styles from './ResumePDF.module.css';

export const ResumePDF = () => {
  return (
    <iframe frameBorder="0" width="100%" height="1200px" src={getImageUrl("resume/Resume4-21-25.pdf")} className={styles.iframe}></iframe>
  )
}

