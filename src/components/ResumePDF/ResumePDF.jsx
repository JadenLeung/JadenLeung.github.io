import React from 'react'
import { getImageUrl } from '../../utils';
import styles from './ResumePDF.module.css';

export const ResumePDF = () => {
  return (
    <iframe frameBorder="0" width="100%" height="1200px" src={getImageUrl("resume/ResumeUSA9:15:26.pdf")} className={styles.iframe}></iframe>
  )
}

