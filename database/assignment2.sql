-- Insert Tony Stark to account table
INSERT INTO public.account(
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- UPDATE Tony to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

-- DELETE Tony
DELETE FROM public.account
WHERE account_firstname = 'Tony';

-- MODIFY GM HUMMER from small interiors to huge interior
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' and inv_model = 'Hummer';

-- Use an inner join
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification
	ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- MODIFY all records to include "/vehicles" in the file path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

