import jwt from 'jsonwebtoken'

interface JwtPayload {
    userId: string;
  }
  
export const signJwtToken = (userId: string):string => {
    return jwt.sign(
        {
            userId,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '2 days' }
    )
}

export const verifyTokenAndGetUserId = (token:string):string => {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    return payload.userId
}
