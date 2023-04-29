import { IColumn, IUser } from '@/store'
export function addColumnAvatar (data: IColumn | IUser) {
  if (!data.avatar) {
    data.avatar = {
      fitUrl: require((data as IColumn).title
        ? '@/assets/column.jpg'
        : '@/assets/avatar.jpg')
    }
  }
}

interface CheckCondition {
  format?: string[]
  size?: number
}

type ErrorType = 'size' | 'format' | null

export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }

  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

interface TestProps {
  _id: string
  name: string
}
const testData: TestProps[] = [
  { _id: '1', name: 'a' },
  { _id: '2', name: 'b' }
]

export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  return arr.reduce((pre, cur) => {
    if (cur._id) pre[cur._id] = cur
    return pre
  }, {} as { [key: string]: T })
}

export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map((key) => obj[key])
}
