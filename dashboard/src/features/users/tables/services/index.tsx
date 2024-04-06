

import { FC, useCallback, useEffect, useState } from "react";
import {
} from '@marzneshin/features/inbounds';
import { Button, DataTable } from "@marzneshin/components";
import { columns } from "./columns";
import { UserType, useUsersUpdateMutation } from "@marzneshin/features/users";
import { useTranslation } from "react-i18next";
import { RowSelectionState } from "@tanstack/react-table";
import {
    ServiceType,
    useServicesQuery,
} from "@marzneshin/features/services";

interface UserServicesTableProps {
    user: UserType
}

// TODO: Implement pagination for row selectable with appliedable action table
export const UserServicesTable: FC<UserServicesTableProps> = ({ user }) => {
    const { mutate: updateUser } = useUsersUpdateMutation();
    const { data } = useServicesQuery({ page: 1, size: 100 });
    const [selectedService, setSelectedService] = useState<{ [key: number]: boolean }>({})
    const { t } = useTranslation()

    useEffect(() => {
        setSelectedService((prevSelected) => {
            const updatedSelected: RowSelectionState = { ...prevSelected };
            user.services.forEach((serviceId) => {
                data.entity.forEach((fetchedService: ServiceType, i) => {
                    if (fetchedService.id === serviceId) {
                        updatedSelected[i] = true;
                    }
                });
            });
            return updatedSelected;
        });
    }, [data, user.services])

    const handleApply = useCallback(() => {
        const selectedServiceIds = Object.keys(selectedService)
            .filter(key => selectedService[parseInt(key)])
            .map(key => data.entity[parseInt(key)].id);
        updateUser({ ...user, services: selectedServiceIds });
    }, [data, selectedService, user, updateUser]);

    const disabled = (Object.keys(selectedService).length < 1) ? true : false

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={data.entity}
                filteredColumn='name'
                selectedRow={selectedService}
                setSelectedRow={setSelectedService}
            />

            <Button onClick={handleApply} disabled={disabled}>{t('apply')}</Button>
        </div>
    )
}
