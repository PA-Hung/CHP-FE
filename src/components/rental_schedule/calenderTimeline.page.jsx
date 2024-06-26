import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs().locale("vi");
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline"; // a plugin!
import viTranslation from "@/utils/vi.json"; // Import các dữ liệu dịch
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { fetchBooking } from "@/redux/slice/bookingSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { Popover } from "bootstrap";
import '@/styles/fullcalendar.css'


const CalenderTimeLine = () => {
  const dispatch = useDispatch();
  const listBookings = useSelector((state) => state.booking.result);
  const calendarRef = useRef(null);
  const themeMode = useSelector((state) => state.theme.themeMode);
  const [searchValue, setSearchValue] = useState(null);

  const buildQuery = (params, sort, filter, page = 1, pageSize = 100) => {
    const clone = { ...params };
    if (clone.phone) clone.phone = `/${clone.phone}/i`;
    if (clone.name) clone.name = `/${clone.name}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.phone) {
      sortBy = sort.phone === "ascend" ? "sort=phone" : "sort=-phone";
    }
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }

    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&sort=-updatedAt`;
    } else {
      temp = `current=${page}&pageSize=${pageSize}&${temp}&${sortBy}`;
    }
    return temp;
  };

  useEffect(() => {
    const initData = async () => {
      if (searchValue) {
        const query = buildQuery(searchValue);
        dispatch(fetchBooking({ query }));
      } else {
        const query = buildQuery();
        dispatch(fetchBooking({ query }));
      }
    };
    initData();
  }, []);

  const listResources = listBookings.flatMap((item) => (
    item.motors.map(motor => {
      return {
        id: motor._id,
        title: motor.brand,
        license: motor.license
      }
    })
  ));

  const calculateRentalDays = (startDate, endDate) => {
    const start = startDate ? dayjs(startDate) : dayjs();
    const end = endDate ? dayjs(endDate) : dayjs().add(1, "day");
    return end.diff(start, 'day');
  }

  const listEvents = listBookings.flatMap((item) =>
    item.motors.map((motor) => ({
      title: `${item.guest_id.name} - ${calculateRentalDays(motor.start_date, motor.end_date)} ngày`,
      id: motor._id,
      start: new Date(motor.start_date),
      end: new Date(motor.end_date),
      resourceId: motor._id, // ID của tài nguyên
      extendedProps: {
        name: item.guest_id.name,
        phone: item.guest_id.phone,
        cccd: item.guest_id.cccd,
      },
      backgroundColor: getRandomColor(),
      borderColor: "#FFFFFF",
      textColor: "#FFFFFF",
    }))
  );

  const eventDidMount = (info) => {
    console.log('info', info);
    return new Popover(info.el, {
      title: info.event.extendedProps.name,
      placement: "auto",
      trigger: "hover",
      customClass: "popoverStyle",
      content: `<p>Thời gian : ${dayjs.utc(info.event._instance.range.start).format("DD")} - ${dayjs.utc(info.event._instance.range.end).format("DD/MM/YYYY")}</p>
      <p>Số ngày thuê : ${calculateRentalDays(info.event._instance.range.start, info.event._instance.range.end)} ngày</p>
      <p>Điện thoại : ${info.event.extendedProps.phone}</p>
      <p>CCCD : ${info.event.extendedProps.cccd}</p>`,
      html: true,
    });
  };

  // Hàm tạo màu ngẫu nhiên
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      // Thay đổi từ Math.random() * 16 thành Math.random() * 10 để giảm khả năng các màu sáng
      color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
  }


  return (
    <div style={{ color: "black", padding: "15px" }}>
      <FullCalendar
        ref={calendarRef} // Sử dụng useRef để gắn FullCalendar
        headerToolbar={{
          left: "today",
          center: "title",
          right: "prev,next",
        }}
        locale="vi"
        height={"77vh"}
        buttonText={viTranslation}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[resourceTimelinePlugin]}
        initialView="resourceTimelineWeek" // resourceTimelineDay resourceTimelineWeek resourceTimelineMonth resourceTimelineYear
        resourceAreaWidth={"15%"}
        displayEventTime={false}
        duration={7}
        slotDuration={{ days: 1 }} // Đặt slotDuration thành 1 ngày
        slotMinTime="00:00:00" // Bắt đầu từ đầu ngày
        slotMaxTime="24:00:00" // Kết thúc vào cuối ngày
        resourceAreaColumns={[
          {
            field: "title",
            headerContent: "Xe",
          },
          {
            field: "license",
            headerContent: "Biển số",
          },
        ]}
        resources={listResources}
        events={listEvents}
        eventDidMount={eventDidMount}
      />
    </div>
  );
};

export default CalenderTimeLine;
