import * as yup from 'yup';

export const svgOptionsSchema = yup.object({
  path: yup.string().default('src/icons'),
  width: yup.number(),
  height: yup.number(),
  size: yup.number(),
  label: yup.string(),
  className: yup.string(),
});
