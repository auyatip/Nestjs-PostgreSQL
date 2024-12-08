----------------------------------
## BACK END question
----------------------------------
## 1. Assuming the system currently has three microservices: Customer API, Master Data API,and Transaction Data API, there is a new feature that requires data from all threemicroservices to be displayed in near real-time. The current technology stack includesREST APIs and an RDBMS database. How would you design a new API for this feature?

### Answer:
1. Create a new service , acting as the orchestrator for the microservices.
2. Choose technology that is fast like NodeJs, NestJs and use Database Cache (Redis) for catch data no long time.
3. Use a message broker like Kafka if the system needs real-time updates in the future.
4. when you design API should be have Query Parameters when get Data.


------------------------------------------------------------------------------------------------------------

## 2. Assuming the team has started planning a new project, the project manager asks you for a performance test strategy plan for this release. How would you recommend proceeding to the project manager?

### Answer:
1. define goal and scope of project release.
2. understand the app/web and system architecture.
3. prepare the environment like Production environment. such as Staging/Tat/Dev evironment
4. simulate user behavior.
5. choose a testing tool such as JMeter,
6. excute the test.
7. analyze results.
8. report results.
9. improvement and repeat testing.

------------------------------------------------------------------------------------------------------------
3. Design and develop two APIs using NestJS and Postgres with the following
specifications:

answer = In The Code
------------------------------------------------------------------------------------------------------------

----------------------------------
## FRONT END question
----------------------------------

## useCallback คืออะไร

### Answer:
ส่วนใหญ่จะใช้ในการ optimize ให้มีความเร็วขึ้น เพราะถ้าใช้ useCallback จะป้องกันการรีเรนเดอร์ใหม่ของ Function ที่ไม่จำเป็นต้อง re-render ทุกครั้งเมื่อมีการ render component นั้น จะเรียก Function ใหม่ก็ต่อเมื่อมีค่า ใน dependencies เปลี่ยนแปลงไป


------------------------------------------------------------------------------------------------------------
### 2. Unit-test by Jest

```javascript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

// Mock ฟังก์ชัน fetch
global.fetch = jest.fn();

describe('UserProfile Component', () => {
  it('แสดงสถานะ loading ตอนเริ่มต้น', () => {
    // Mock การเรียก fetch ให้สำเร็จ
    fetch.mockResolvedValueOnce({ ok: true, json: () => ({ name: 'John Doe', email: 'john@example.com' }) });

    render(<UserProfile userId="1" />);

    // ตรวจสอบว่าแสดงข้อความ "Loading..." ตอนเริ่มต้น
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('แสดงข้อมูลผู้ใช้หลังจาก fetch สำเร็จ', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    fetch.mockResolvedValueOnce({ ok: true, json: () => mockUser });

    render(<UserProfile userId="1" />);

    // รอให้ component จบการดึงข้อมูลและทำการ re-render
    await waitFor(() => screen.getByText(mockUser.name));

    // ตรวจสอบว่าแสดงข้อมูลผู้ใช้
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
  });

  it('แสดงข้อความ error หาก fetch ล้มเหลว', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch user data'));

    render(<UserProfile userId="1" />);

    // รอให้ component จบการดึงข้อมูล
    await waitFor(() => screen.getByText(/Error: Failed to fetch user data/i));

    // ตรวจสอบว่าแสดงข้อความ error
    expect(screen.getByText(/Error: Failed to fetch user data/i)).toBeInTheDocument();
  });
});
